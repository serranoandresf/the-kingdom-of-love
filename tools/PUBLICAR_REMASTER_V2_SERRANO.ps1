$ErrorActionPreference = 'Stop'

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$repoUrl = 'https://github.com/serranoandresf/the-kingdom-of-love.git'
$pagesUrl = 'https://serranoandresf.github.io/the-kingdom-of-love/'

function Invoke-Git {
    param([Parameter(Mandatory=$true)][string[]]$GitArgs)
    & git @GitArgs
    if ($LASTEXITCODE -ne 0) {
        throw "Falló git $($GitArgs -join ' ') con código $LASTEXITCODE."
    }
}

foreach ($required in @(
    'index.html',
    'src\auralia-remaster.js',
    'src\auralia-remaster-v2.js',
    'assets\audio\auralia-world-0.mp3',
    'assets\characters\andres-portrait.webp',
    'assets\characters\vannesa-portrait.webp'
)) {
    if (-not (Test-Path (Join-Path $projectRoot $required))) {
        throw "No se encontró $required. Extrae e instala primero el paquete V2 en la raíz del proyecto."
    }
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    throw 'Git no está instalado o no está disponible en PATH.'
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw 'Node.js no está instalado o no está disponible en PATH.'
}

Write-Host 'Validando el proyecto local...' -ForegroundColor Cyan
Push-Location $projectRoot
try {
    & node '.\tools\validate_project.cjs'
    if ($LASTEXITCODE -ne 0) { throw 'La validación del proyecto falló. No se publicará.' }
}
finally {
    Pop-Location
}

$work = Join-Path $env:TEMP ('auralia-remaster-v2-' + [Guid]::NewGuid().ToString('N'))
Write-Host "Clonando el repositorio oficial en $work ..." -ForegroundColor Cyan
Invoke-Git -GitArgs @('clone', '--branch', 'main', '--single-branch', $repoUrl, $work)

Write-Host 'Copiando la versión local validada al clon de publicación...' -ForegroundColor Cyan
$excluded = @((Join-Path $projectRoot '.git'), (Join-Path $projectRoot '.auralia-backups'))
& robocopy $projectRoot $work /E /XD $excluded /R:2 /W:1 /NFL /NDL /NJH /NJS
$copyCode = $LASTEXITCODE
if ($copyCode -ge 8) { throw "Robocopy no pudo copiar el proyecto (código $copyCode)." }

Invoke-Git -GitArgs @('-C', $work, 'add', '-A')
& git -C $work diff --cached --quiet
$diffCode = $LASTEXITCODE
if ($diffCode -eq 0) {
    Write-Host 'No hay cambios nuevos que publicar. El repositorio ya coincide con esta copia.' -ForegroundColor Yellow
    Write-Host "Clon de revisión: $work"
    exit 0
}
if ($diffCode -ne 1) { throw "No se pudo comprobar el diff de Git (código $diffCode)." }

Write-Host 'Creando commit...' -ForegroundColor Cyan
Invoke-Git -GitArgs @('-C', $work, 'commit', '-m', 'Auralia Definitive Remaster V2')
Write-Host 'Enviando cambios a serranoandresf/the-kingdom-of-love...' -ForegroundColor Cyan
Invoke-Git -GitArgs @('-C', $work, 'push', 'origin', 'main')

Write-Host ''
Write-Host 'Publicación enviada correctamente.' -ForegroundColor Green
Write-Host "Repositorio: $repoUrl"
Write-Host "Página: $pagesUrl"
Write-Host "Clon conservado para revisión: $work"
Write-Host 'Comprueba la ejecución de GitHub Actions antes de compartir el nuevo enlace.' -ForegroundColor Yellow
