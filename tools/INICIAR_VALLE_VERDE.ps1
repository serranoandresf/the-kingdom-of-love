$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$repoExpected = "https://github.com/serranoandresf/the-kingdom-of-love.git"
$branchName = "remaster/valle-verde-production"
$baseCommitExpected = "0a510c8d15b1090e5edf07077f16ea51603a761c"

Write-Host "`n=== VALLE VERDE | PREPARACION DE RAMA ===" -ForegroundColor Cyan
if (-not (Test-Path ".git")) { throw "Esta carpeta no contiene el repositorio Git esperado." }
$origin = (git remote get-url origin).Trim()
if ($LASTEXITCODE -ne 0 -or $origin -ne $repoExpected) { throw "El remoto origin no coincide con el repositorio del videojuego: $origin" }

$expectedPaths = @(
    "docs/VALLE-VERDE-MASTER-PRODUCTION-PROMPT.md",
    "docs/VALLE-VERDE-GAME-BIBLE.md",
    "docs/VALLE-VERDE-ART-DIRECTION.md",
    "docs/VALLE-VERDE-GAMEPLAY-SPEC.md",
    "docs/VALLE-VERDE-LEVEL-DESIGN.md",
    "docs/VALLE-VERDE-QA.md",
    "docs/VALLE-VERDE-ROADMAP.md",
    "docs/VALLE-VERDE-STATUS.md",
    "tools/INICIAR_VALLE_VERDE.ps1"
)
$expectedSet = [System.Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
foreach ($item in $expectedPaths) { [void]$expectedSet.Add($item) }
$unexpected = @()
foreach ($line in (git status --porcelain -uall)) {
    if ($line.Length -lt 4) { continue }
    $path = $line.Substring(3).Trim('"')
    if (-not $expectedSet.Contains($path)) { $unexpected += $line }
}
if ($unexpected.Count -gt 0) {
    $unexpected | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
    throw "Hay cambios locales distintos al paquete VALLE VERDE. No se tocarán ni se sobrescribirán."
}
foreach ($item in $expectedPaths) {
    if (-not (Test-Path $item -PathType Leaf)) { throw "Falta el archivo esperado: $item. Extrae el ZIP en la raíz del proyecto." }
}

$currentBranch = (git branch --show-current).Trim()
if ($currentBranch -ne "main") { throw "Estás en la rama '$currentBranch'. Cambia a main después de guardar tu trabajo y vuelve a ejecutar." }

Write-Host "Actualizando referencias remotas..." -ForegroundColor Cyan
git fetch origin
if ($LASTEXITCODE -ne 0) { throw "git fetch falló." }

$remoteMain = (git rev-parse refs/remotes/origin/main).Trim()
git merge-base --is-ancestor $baseCommitExpected $remoteMain
if ($LASTEXITCODE -ne 0) { throw "origin/main no contiene el commit base auditado. Requiere nueva auditoría." }

$existingRemote = git ls-remote --heads origin "refs/heads/$branchName"
if ($existingRemote) { throw "La rama remota $branchName ya existe. No se sobrescribirá." }
$existingLocal = git branch --list $branchName
if ($existingLocal) { throw "La rama local $branchName ya existe. No se sobrescribirá." }

if ($remoteMain -ne (git rev-parse HEAD).Trim()) {
    Write-Host "Sincronizando main mediante fast-forward..." -ForegroundColor Cyan
    git pull --ff-only origin main
    if ($LASTEXITCODE -ne 0) { throw "No se pudo avanzar main de forma segura." }
}

Write-Host "Creando rama desde origin/main: $branchName" -ForegroundColor Cyan
git switch -c $branchName origin/main
if ($LASTEXITCODE -ne 0) { throw "No se pudo crear la rama local." }

git add -- $expectedPaths
if ($LASTEXITCODE -ne 0) { throw "No se pudieron preparar los documentos." }
git diff --cached --check
if ($LASTEXITCODE -ne 0) { throw "git diff --check encontró errores." }

Write-Host "`n=== RESUMEN DE DOCUMENTACION ===" -ForegroundColor Cyan
git diff --cached --stat

Write-Host "`n=== CREANDO COMMIT DE BIBLIA Y PRODUCCION ===" -ForegroundColor Cyan
git commit -m "docs: establish Valle Verde production bible and roadmap"
if ($LASTEXITCODE -ne 0) { throw "No se pudo crear el commit." }

Write-Host "`n=== PUBLICANDO RAMA DE TRABAJO ===" -ForegroundColor Cyan
git push --set-upstream origin $branchName
if ($LASTEXITCODE -ne 0) { throw "El commit local existe, pero GitHub no confirmó la publicación de la rama." }

Write-Host "`n=== RESULTADO ===" -ForegroundColor Green
git log -1 --format="Commit: %H%nMensaje: %s"
git status -sb
Write-Host "`nmain y GitHub Pages no han sido modificadas." -ForegroundColor Green
