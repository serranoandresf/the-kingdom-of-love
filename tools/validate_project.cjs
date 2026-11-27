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
  'assets/worlds/valle-capitulo-1-tileset.svg',
  'assets/share/og-cover.jpg', 'assets/icons/icon-192.png', 'assets/icons/icon-512.png',
  'assets/icons/apple-touch-icon.png', 'assets/characters/andres-animation-reference.webp',
  'assets/characters/vannesa-animation-reference.webp', 'tools/set-github-pages-url.cjs'
];
for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) throw new Error(`Falta archivo requerido: ${file}`);
}
for (const file of ['src/config.js','src/data.js','src/art.js','src/auralia-remaster.js','src/auralia-remaster-v2.js','src/game.js','src/pwa.js','tools/set-github-pages-url.cjs','tools/validate_project.cjs','tools/export-character-sheets.cjs','tools/audit-character-sheets.cjs','sw.js']) {
  cp.execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'inherit' });
}
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'src/data.js'), 'utf8'), context);
const { worlds, levels } = context.window.LOVE_GAME_DATA;
if (worlds.length !== 5) throw new Error(`Se esperaban 5 mundos; hay ${worlds.length}`);
if (levels.length !== 15) throw new Error(`Se esperaban 15 capÃ­tulos; hay ${levels.length}`);
const expectedWorlds = ['EL PUEBLO DE LOS ZÓCALOS','EL MALECÓN DE LAS MIL VELAS','LAS ISLAS DEL EMBALSE','LOS CAMINOS DE ARRIERÍA','LA ROCA DEL VIGÍA'];
if (worlds.length !== 5 || worlds.some((world, i) => world.name !== expectedWorlds[i])) throw new Error("Los cinco mundos no corresponden a la identidad GUATAPÉ");
const issues = [];
for (const [i, level] of levels.entries()) {
  const prefix = `CapÃ­tulo ${i + 1}:`;
  if (level.boss !== (level.stage === 2)) issues.push(`${prefix} bandera de guardiÃ¡n incorrecta`);
  if (!level.platforms?.length || !level.enemies?.length || !level.coinTracks?.length) issues.push(`${prefix} faltan plataformas, enemigos o monedas`);
  if (!level.star || !level.secret || !level.checkpoints?.length) issues.push(`${prefix} faltan recompensa o checkpoint`);
  if (!level.resonators?.length || !level.resonanceHint) issues.push(`${prefix} falta resonador y texto de ayuda`);
  if (!level.story || /EL REY DEL OLVIDO|REINO DE LOS COMIENZOS|MONTAÃ‘AS DE CRISTAL/.test(level.story)) issues.push(`${prefix} conserva texto de la narrativa anterior`);
  for (const [x, y, w] of level.platforms) if (x < 0 || x > level.length || w <= 0) issues.push(`${prefix} plataforma fuera del mapa`);
  for (const [x, y, w, min, max, speed] of level.moving) if (x < min || x > max || min < 0 || max > level.length || speed <= 0) issues.push(`${prefix} plataforma mÃ³vil invÃ¡lida`);
  for (const [x, kind, min, max, speed] of level.enemies) if (x < 0 || x > level.length || min < 0 || max > level.length || min >= max || speed <= 0) issues.push(`${prefix} enemigo invÃ¡lido (${kind})`);
  if (level.boss && !level.bossArena) issues.push(`${prefix} falta arena del guardiÃ¡n`);
  for (const [x, y] of level.resonators) if (x < 400 || x > level.length - 150 || y < 300 || y > 470) issues.push(`${prefix} resonador fuera de zona vÃ¡lida`);
}
if (issues.length) throw new Error(issues.join('\n'));
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.webmanifest'), 'utf8'));
if (manifest.display !== 'standalone' || manifest.start_url !== './' || manifest.scope !== './') throw new Error('Manifiesto PWA invÃ¡lido');
if (!html.includes('https://serranoandresf.github.io/the-kingdom-of-love/')) throw new Error('Falta URL canónica real de GitHub Pages');
if (!html.includes('data-control="resonance"')) throw new Error('Falta botÃ³n tÃ¡ctil de resonancia');
if (!html.includes('property="og:image"') || !html.includes('og:description')) throw new Error('Faltan metadatos sociales');
for (const ref of [...html.matchAll(/(?:src|href)="\.\/([^"]+)"/g)].map(m => m[1])) {
  if (/^(https?:|#)/.test(ref)) continue;
  if (!fs.existsSync(path.join(root, ref))) throw new Error(`Recurso local del HTML no encontrado: ${ref}`);
}
const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
for (const asset of ['index.html','style.css','src/game.js','assets/share/og-cover.jpg','assets/worlds/valle-capitulo-1-tileset.svg']) {
  if (!sw.includes(`"./${asset}"`)) throw new Error(`El Service Worker no precarga: ${asset}`);
}
if (!sw.includes('kol-guatape-prealpha-')) throw new Error('La caché no fue versionada para el capítulo 1 definitivo');
for (const asset of ['assets/characters/andres-gameplay-sheet.png','assets/characters/vannesa-gameplay-sheet.png']) {
  if (!sw.includes('"./' + asset + '"')) throw new Error('El Service Worker no precarga: ' + asset);
  const png = fs.readFileSync(path.join(root,asset));
  if (png.subarray(0,8).toString('hex') !== '89504e470d0a1a0a' || png.readUInt32BE(16) !== 1024 || png.readUInt32BE(20) !== 684 || png[25] !== 6) {
    throw new Error('Spritesheet inválido (se esperaba PNG RGBA de 1024×684): ' + asset);
  }
}
const workflow = fs.readFileSync(path.join(root,'.github/workflows/pages.yml'),'utf8');
for (const token of ['actions/checkout@v6','actions/configure-pages@v5','actions/upload-pages-artifact@v4','actions/deploy-pages@v4','pages: write','id-token: write']) {
  if (!workflow.includes(token)) throw new Error(`Workflow de GitHub Pages incompleto: falta ${token}`);
}
const game = fs.readFileSync(path.join(root, 'src/game.js'), 'utf8');
for (const token of ['class Prologue','buildResonators','ringResonance','resonanceKey','damageBoss','bossPhase','saveProgress','movingPlatforms','AURALIA']) {
  if (!game.includes(token)) throw new Error(`No se encontrÃ³ sistema V5 esperado: ${token}`);
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
if (og[0]!==0xff || og[1]!==0xd8 || og[2]!==0xff) throw new Error('La imagen Open Graph no es JPEG vÃ¡lido');
const art = fs.readFileSync(path.join(root,'src/art.js'),'utf8');
if (!art.includes('texture(scene,"resonator"')) throw new Error('Falta textura del resonador');
const valleyTiles = fs.readFileSync(path.join(root,'assets/worlds/valle-capitulo-1-tileset.svg'),'utf8');
const tileFrames = [...valleyTiles.matchAll(/<g transform="translate\(/g)].length;
if (!valleyTiles.includes('width="288" height="192" viewBox="0 0 288 192"') || tileFrames !== 24) throw new Error(`Tileset del Valle invÃ¡lido: se esperaban 24 cuadros, hay ${tileFrames}`);
if (!game.includes('load.spritesheet("valleyProductionTiles"') || !game.includes('"valleyProductionTiles",0') || !game.includes('"valleyProductionTiles",1')) throw new Error('El tileset del capÃ­tulo 1 no estÃ¡ integrado en Phaser');
const remaster = fs.readFileSync(path.join(root,'src/auralia-remaster.js'),'utf8');
if (!remaster.includes('scene.anims.create') || !remaster.includes('frameRate: gait === "walk" ? 7 : 10')) throw new Error('Faltan ciclos de animaciÃ³n de caminar/correr');
if (!remaster.includes('REFERENCE_POSES') || !remaster.includes('createReferenceAnimations(scene)') || !remaster.includes('frameFor: poseFrame') || !game.includes('andresGameplaySheet') || !game.includes('vannesaGameplaySheet')) throw new Error('Las hojas de personaje no estÃ¡n conectadas a sus animaciones de gameplay');
if (!remaster.includes('VANNESA: { idle:[0,1], walk:[2,3], run:[4,5,6,7], jump:[6], fall:[7], land:[0], attack:[8,9], special:[8,9]')) throw new Error('VANNESA debe conservar el proyectil y su secuencia visual de preparación/lanzamiento');
if (!game.includes('setSize(84,156).setOffset(84,65)') || !game.includes('this.player.setScale(.30).setOrigin(.5,.97)')) throw new Error('Cambió inesperadamente la escala o hitbox del personaje de referencia');
if (!game.includes('FLOOR-44') || !game.includes('inspectLevel(){') || !game.includes('bottomBlocked:enemy.body.blocked.down')) throw new Error('Spawn de enemigos o lectura QA de física del nivel incompletos');
if (!game.includes('this.physics.world.pause()') || !game.includes('this.time.delayedCall(750')) throw new Error('La salida del capítulo debe pausar la física y mostrar la pose final');
if (!remaster.includes('ACTION_TIMELINES') || !remaster.includes('impactSequenceIndex: 2') || !game.includes('handleActionAnimationUpdate') || !game.includes('handleActionAnimationComplete') || !game.includes('lastAction:scene.lastAction') || !game.includes('savedProgress:readSave()')) throw new Error('Falta la sincronizaciÃ³n de acciÃ³n y el inspector QA del progreso guardado');
if (!game.includes('inspectAssets(){') || !game.includes('tilesetFrames:frameNames.filter') || !fs.readFileSync(path.join(root,'tools/capture-gameplay.html'),'utf8').includes('inspectAssets()')) throw new Error('El panel de QA no expone la comprobación de texturas del runtime');
const capturePanel = fs.readFileSync(path.join(root, 'tools/capture-gameplay.html'), 'utf8');
if (!capturePanel.includes('disabled>') || !capturePanel.includes('requestAnimationFrame') || !capturePanel.includes('acceptance-${role}-${label}') || !game.includes('inspectLevel(){')) throw new Error('El panel QA debe esperar recursos estables y exponer evidencia e inspección del capítulo');
for (const capture of ['QA_CAPTURAS/capitulo-1-andres.png','QA_CAPTURAS/capitulo-1-vannesa.png']) {
  const png = fs.readFileSync(path.join(root,capture));
  if (png.subarray(0,8).toString('hex') !== '89504e470d0a1a0a' || png.readUInt32BE(16) !== 960 || png.readUInt32BE(20) !== 540) {
    throw new Error('Captura real de QA inválida (se esperaba PNG 960×540): ' + capture);
  }
}
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
  pwa:'manifest, rutas y cachÃ© versionada verificados',
  mobile:'controles tÃ¡ctiles izquierda/derecha/salto/habilidad/resonancia presentes',
  chapterOne:'tileset SVG y hojas 4x3 RGBA de Andrés/VANNESA integrados en Phaser',
  gameplayCaptures:'dos PNG 960x540 exportados desde Renderer.snapshot y validados',
  note:'Este reporte solo cubre validaciones automatizadas; las pruebas de navegador real están documentadas en REGISTRO_PRUEBAS_AURALIA.md. No se validó teléfono físico.'
},null,2));
