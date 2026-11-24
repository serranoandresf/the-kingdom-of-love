const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
const required = [
  'index.html', 'style.css', 'README.md', 'PUBLICAR_EN_GITHUB_PAGES.md',
  'INICIAR_JUEGO.bat', 'SUBIR_A_GITHUB.ps1', 'manifest.webmanifest', 'sw.js', '.nojekyll',
  '.github/workflows/pages.yml',
  'src/config.js', 'src/data.js', 'src/art.js', 'src/game.js', 'src/pwa.js',
  'assets/concept/title-screen-concept.webp', 'assets/worlds/valle-de-las-campanas.webp',
  'assets/share/og-cover.jpg', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png',
  'assets/icons/apple-touch-icon.png', 'assets/characters/andres-animation-reference.webp',
  'assets/characters/vannesa-animation-reference.webp', 'tools/set-github-pages-url.cjs'
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Falta archivo requerido: ${file}`);
}
for (const file of ['src/config.js','src/data.js','src/art.js','src/game.js','src/pwa.js','tools/set-github-pages-url.cjs','tools/validate_project.cjs','sw.js']) {
  cp.execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });
}
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'src/data.js'), 'utf8'), context);
const { worlds, levels } = context.window.LOVE_GAME_DATA;
if (worlds.length !== 5) throw new Error(`Se esperaban 5 mundos; hay ${worlds.length}`);
if (levels.length !== 15) throw new Error(`Se esperaban 15 capítulos; hay ${levels.length}`);
const expectedWorlds = ['VALLE DE LAS CAMPANAS','BOSQUE DE LAS LUCIÉRNAGAS','MAR DE VIDRIO','CUMBRES DEL INVIERNO AZUL','CIUDAD DEL ECLIPSE'];
worlds.forEach((world, i) => { if (world.name !== expectedWorlds[i]) throw new Error(`Nombre incorrecto del mundo ${i+1}: ${world.name}`); });
const issues = [];
for (const [i, level] of levels.entries()) {
  const prefix = `Capítulo ${i + 1}:`;
  if (level.boss !== (level.stage === 2)) issues.push(`${prefix} bandera de guardián incorrecta`);
  if (!level.platforms?.length || !level.enemies?.length || !level.coinTracks?.length) issues.push(`${prefix} faltan plataformas, enemigos o monedas`);
  if (!level.star || !level.secret || !level.checkpoints?.length) issues.push(`${prefix} faltan recompensa o checkpoint`);
  if (!level.resonators?.length || !level.resonanceHint) issues.push(`${prefix} falta resonador y texto de ayuda`);
  if (!level.story || /EL REY DEL OLVIDO|REINO DE LOS COMIENZOS|MONTAÑAS DE CRISTAL/.test(level.story)) issues.push(`${prefix} conserva texto de la narrativa anterior`);
  for (const [x, y, w] of level.platforms) if (x < 0 || x > level.length || w <= 0) issues.push(`${prefix} plataforma fuera del mapa`);
  for (const [x, y, w, min, max, speed] of level.moving) if (x < min || x > max || min < 0 || max > level.length || speed <= 0) issues.push(`${prefix} plataforma móvil inválida`);
  for (const [x, kind, min, max, speed] of level.enemies) if (x < 0 || x > level.length || min < 0 || max > level.length || min >= max || speed <= 0) issues.push(`${prefix} enemigo inválido (${kind})`);
  if (level.boss && !level.bossArena) issues.push(`${prefix} falta arena del guardián`);
  for (const [x, y] of level.resonators) if (x < 400 || x > level.length - 150 || y < 300 || y > 470) issues.push(`${prefix} resonador fuera de zona válida`);
}
if (issues.length) throw new Error(issues.join('\n'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
if (manifest.display !== 'standalone' || manifest.start_url !== './' || manifest.scope !== './') throw new Error('Manifiesto PWA inválido');
if (!html.includes('https://TU-USUARIO.github.io/TU-REPOSITORIO/')) throw new Error('Falta placeholder GitHub Pages canónico');
if (!html.includes('data-control="resonance"')) throw new Error('Falta botón táctil de resonancia');
if (!html.includes('property="og:image"') || !html.includes('og:description')) throw new Error('Faltan metadatos sociales');
for (const ref of [...html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)].map(m => m[1])) {
  if (/^(https?:|#)/.test(ref)) continue;
  if (!fs.existsSync(path.join(root, ref))) throw new Error(`Recurso local del HTML no encontrado: ${ref}`);
}
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
for (const asset of ['index.html','style.css','src/game.js','assets/share/og-cover.jpg','assets/concept/title-screen-concept.webp','assets/worlds/valle-de-las-campanas.webp']) {
  if (!sw.includes(`"./${asset}"`)) throw new Error(`El Service Worker no precarga: ${asset}`);
}
if (!sw.includes('kol-v5-')) throw new Error('La caché no fue versionada para V5');
const workflow = fs.readFileSync(path.join(root,'.github/workflows/pages.yml'),'utf8');
for (const token of ['actions/checkout@v6','actions/configure-pages@v5','actions/upload-pages-artifact@v4','actions/deploy-pages@v4','pages: write','id-token: write']) {
  if (!workflow.includes(token)) throw new Error(`Workflow de GitHub Pages incompleto: falta ${token}`);
}
const game = fs.readFileSync(path.join(root, 'src/game.js'), 'utf8');
for (const token of ['class Prologue','buildResonators','ringResonance','resonanceKey','damageBoss','bossPhase','saveProgress','movingPlatforms','AURALIA']) {
  if (!game.includes(token)) throw new Error(`No se encontró sistema V5 esperado: ${token}`);
}
// Evaluate the entrypoint with a minimal Phaser shell. This verifies scene assembly,
// not actual rendering, physics or playthrough in a real browser.
const PhaserMock = {
  Scene: class Scene {}, AUTO:'AUTO',
  Scale:{FIT:'FIT',CENTER_BOTH:'CENTER_BOTH'},
  Game:class Game{constructor(config){this.config=config;}}
};
const runtime = {
  window:{Phaser:PhaserMock,LOVE_GAME_CONFIG:{},LOVE_GAME_DATA:{worlds,levels},addEventListener:()=>{}},
  Phaser:PhaserMock,
  localStorage:{getItem:()=>null,setItem:()=>{}},
  document:{querySelectorAll:()=>[],addEventListener:()=>{},hidden:false}
};
vm.runInNewContext(game,runtime);
if (!runtime.window.Phaser) throw new Error('No se pudo evaluar el entrypoint Phaser');
const og = fs.readFileSync(path.join(root,'assets/share/og-cover.jpg'));
if (og[0]!==0xff || og[1]!==0xd8 || og[2]!==0xff) throw new Error('La imagen Open Graph no es JPEG válido');
const art = fs.readFileSync(path.join(root,'src/art.js'),'utf8');
if (!art.includes('texture(scene,"resonator"')) throw new Error('Falta textura del resonador');
console.log(JSON.stringify({
  result:'PASS',
  javascript:'node --check: todos los archivos pasaron',
  sceneAssembly:'entrypoint evaluado con Phaser simulado; no equivale a renderizado real',
  worlds:worlds.length,
  chapters:levels.length,
  guardians:levels.filter(x=>x.boss).length,
  resonators:levels.reduce((sum,x)=>sum+x.resonators.length,0),
  chapterStories:levels.every(x=>x.story.length>30),
  githubPages:'workflow, permisos y placeholders verificados',
  pwa:'manifest, rutas y caché v5 verificados',
  mobile:'controles táctiles izquierda/derecha/salto/habilidad/resonancia presentes',
  note:'No se ejecutó Phaser real ni se probaron teléfonos físicos.'
},null,2));
