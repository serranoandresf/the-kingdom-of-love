#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const cp = require("node:child_process");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const file = rel => path.join(root, rel);
const required = [
  "index.html", "style.css", "sw.js", "src/game.js", "src/art.js",
  "src/auralia-remaster.js", "src/auralia-remaster-v2.js",
  "tools/apply-auralia-remaster.cjs"
];
function fail(message) { console.error(`\nERROR: ${message}\n`); process.exit(1); }
for (const rel of required) if (!fs.existsSync(file(rel))) fail(`Falta ${rel}. Extrae el paquete completo sobre la raíz del proyecto Auralia.`);

// Ensure the V1 compatibility layer is installed before applying V2.
const v1 = cp.spawnSync(process.execPath, [file("tools/apply-auralia-remaster.cjs")], { cwd: root, encoding: "utf8" });
if (v1.stdout) process.stdout.write(v1.stdout);
if (v1.stderr) process.stderr.write(v1.stderr);
if (v1.status !== 0) fail(`No se pudo preparar la base V1 (código ${v1.status}). No se aplicó V2.`);

let index = fs.readFileSync(file("index.html"), "utf8");
let game = fs.readFileSync(file("src/game.js"), "utf8");
let style = fs.readFileSync(file("style.css"), "utf8");
let sw = fs.readFileSync(file("sw.js"), "utf8");
let gitignore = fs.existsSync(file(".gitignore")) ? fs.readFileSync(file(".gitignore"), "utf8") : "";
const originals = { index, game, style, sw, gitignore };

function replaceOnce(source, before, after, label) {
  if (source.includes(after)) return source;
  const count = source.split(before).length - 1;
  if (count !== 1) fail(`${label}: se esperaba una coincidencia exacta y se encontraron ${count}. No se escribieron los archivos V2.`);
  return source.replace(before, after);
}

// Load the V2 atmospheric extension immediately after the V1 art replacement.
index = replaceOnce(index,
  '  <script src="./src/auralia-remaster.js"></script>',
  '  <script src="./src/auralia-remaster.js"></script>\n  <script src="./src/auralia-remaster-v2.js"></script>',
  "Carga de remaster-v2");

// Load five original regional score loops plus the illustrated prologue plate.
const oldPreload = 'preload(){this.load.image("titleCover","assets/concept/title-screen-concept.webp");this.load.image("valleyPanorama","assets/worlds/valle-de-las-campanas.webp")}';
const newPreload = 'preload(){this.load.image("titleCover","assets/concept/title-screen-concept.webp");this.load.image("valleyPanorama","assets/worlds/valle-de-las-campanas.webp");this.load.image("valleyIntroRemaster","assets/worlds/valle-intro-remaster.webp");this.load.image("andresPortrait","assets/characters/andres-portrait.webp");this.load.image("vannesaPortrait","assets/characters/vannesa-portrait.webp");for(let i=0;i<5;i++)this.load.audio("auralia_world_"+i,"assets/audio/auralia-world-"+i+".mp3")}';
game = replaceOnce(game, oldPreload, newPreload, "Precarga de imágenes y música");

// Replace the passive title hitboxes with six real, correctly aligned menu actions.
const titleStart = game.indexOf("  class Title extends Phaser.Scene{");
const titleEnd = game.indexOf("  class Select extends Phaser.Scene{", titleStart);
if (titleStart < 0 || titleEnd < 0) fail("No se pudo localizar el bloque de pantalla principal Title/Select.");
const newTitleClass = `  class Title extends Phaser.Scene{
    constructor(){super("Title")}
    create(){
      startMusic(this,0);
      if(this.textures.exists("titleCover")){this.add.image(W/2,H/2,"titleCover").setDisplaySize(W,H).setDepth(0)}
      else{
        makeBackdrop(this,0,true);addStarField(this,52);
        this.add.text(W/2,65,CFG.title||"THE KINGDOM OF LOVE",{fontFamily:"Georgia,serif",fontSize:"43px",fontStyle:"bold",color:"#fff0c4",stroke:"#573b32",strokeThickness:7}).setOrigin(.5);
        this.add.text(W/2,115,CFG.subtitle||"ANDRÉS & VANNESA",{fontFamily:"Georgia,serif",fontSize:"22px",fontStyle:"bold",color:"#ffdb83"}).setOrigin(.5);
      }
      const progress=getProgress();
      const newGame=()=>this.scene.start("Select",{level:0,score:0,lives:3});
      const continueGame=()=>this.scene.start("Select",{level:progress.level,score:progress.score,lives:progress.lives,coins:progress.coins,hearts:progress.hearts,fragments:progress.fragments,continue:true});
      const menuItems=[
        {x:730,y:254,w:230,h:47,run:newGame},
        {x:730,y:300,w:210,h:43,run:continueGame},
        {x:730,y:341,w:210,h:42,run:()=>this.scene.start("Options")},
        {x:730,y:381,w:210,h:42,run:()=>this.scene.start("Achievements")},
        {x:730,y:420,w:210,h:42,run:()=>this.scene.start("Credits")},
        {x:730,y:460,w:210,h:42,run:()=>showToast(this,"GRACIAS POR VISITAR AURALIA. PUEDES CERRAR ESTA PESTAÑA PARA SALIR.")}
      ];
      menuItems.forEach(item=>{
        const hit=this.add.rectangle(item.x,item.y,item.w,item.h,0xffffff,0).setDepth(6).setInteractive({useHandCursor:true});
        hit.on("pointerover",()=>hit.setFillStyle(0xffedc6,.075));
        hit.on("pointerout",()=>hit.setFillStyle(0xffffff,0));
        hit.on("pointerdown",item.run);
      });
      this.input.keyboard.once("keydown-ENTER",newGame);
      this.input.keyboard.on("keydown-C",continueGame);
    }
  }
`;
game = game.slice(0,titleStart) + newTitleClass + game.slice(titleEnd);

// The Logros item opens an actual progression-aware achievement chronicle.
if (!game.includes("class Achievements extends Phaser.Scene{")) {
  const playMarker = "  class Play extends Phaser.Scene{";
  const achievementsClass = `  class Achievements extends Phaser.Scene{
    constructor(){super("Achievements")}
    create(){
      makeBackdrop(this,4,false);addStarField(this,38);
      this.add.rectangle(W/2,H/2,W,H,0x101629,.74);
      this.add.text(W/2,58,"CRÓNICA DE AURALIA",{fontFamily:"Georgia,serif",fontSize:"34px",fontStyle:"bold",color:"#ffdf91",stroke:"#342943",strokeThickness:4}).setOrigin(.5);
      this.add.text(W/2,94,"Cada nota recuperada deja una huella en el reino",{fontSize:"15px",color:"#e8dfca"}).setOrigin(.5);
      const p=getProgress();
      const entries=[
        {title:"EL PRIMER ECO",desc:"Recupera tu primer fragmento de la Campana del Alba.",done:p.fragments>=1},
        {title:"LAS CINCO NOTAS",desc:"Reúne los cinco fragmentos y restaura la armonía.",done:p.fragments>=5},
        {title:"VIAJERO DE AURALIA",desc:"Alcanza el sexto capítulo de la aventura.",done:p.level>=5},
        {title:"TESOROS DEL REINO",desc:"Reúne al menos 25 monedas durante tu viaje.",done:p.coins>=25},
        {title:"HÉROE DE LEYENDA",desc:"Consigue una puntuación acumulada de 10.000 puntos.",done:p.score>=10000}
      ];
      entries.forEach((entry,i)=>{
        const y=153+i*62,fill=entry.done?0x294b4b:0x20283b,stroke=entry.done?0xe8c16b:0x64708b;
        this.add.rectangle(W/2,y,690,52,fill,.94).setStrokeStyle(2,stroke,.9);
        this.add.text(160,y,entry.done?"✦":"◇",{fontSize:"24px",fontStyle:"bold",color:entry.done?"#ffe29a":"#8793ae"}).setOrigin(.5);
        this.add.text(195,y-8,entry.title,{fontFamily:"Georgia,serif",fontSize:"16px",fontStyle:"bold",color:entry.done?"#ffe5a8":"#d0d6e5"}).setOrigin(0,.5);
        this.add.text(195,y+13,entry.desc,{fontSize:"12px",color:"#e3e5ec"}).setOrigin(0,.5);
        this.add.text(800,y,entry.done?"DESBLOQUEADO":"POR DESCUBRIR",{fontSize:"10px",fontStyle:"bold",color:entry.done?"#f3d58d":"#9da7bb"}).setOrigin(1,.5);
      });
      this.add.text(W/2,472,"FRAGMENTOS: "+p.fragments+"/5     MONEDAS: "+p.coins+"     PUNTOS: "+p.score,{fontSize:"13px",fontStyle:"bold",color:"#f5dca7"}).setOrigin(.5);
      button(this,W/2,515,"VOLVER AL REINO",()=>this.scene.start("Title"),{width:230,height:36,fontSize:"15px"});
    }
  }

`;
  game = replaceOnce(game, playMarker, achievementsClass + playMarker, "Nueva pantalla de logros");
}

game = replaceOnce(game,
  "scene:[Boot,Title,Select,Prologue,Options,Credits,Play,Intermission,GameOver,Finale]",
  "scene:[Boot,Title,Select,Prologue,Options,Credits,Achievements,Play,Intermission,GameOver,Finale]",
  "Registro de escena Achievements");

// Upgrade selection cards with individually framed high-detail character portraits.
game = replaceOnce(game,
  'this.add.image(285,235,"andres_idle").setScale(1.575);',
  'this.add.circle(285,235,79,0xe9c477,.14);\n      if(this.textures.exists("andresPortrait")){this.add.image(285,235,"andresPortrait").setDisplaySize(146,146).setDepth(3);this.add.rectangle(285,235,154,154,0xffffff,0).setStrokeStyle(3,0xe8c16b).setDepth(4)}else this.add.image(285,235,"andres_idle").setScale(1.575);',
  "Retrato HD de Andrés en selección");
game = replaceOnce(game,
  'this.add.image(675,235,"vannesa_idle").setScale(1.575);',
  'this.add.circle(675,235,79,0xf0bad2,.14);\n      if(this.textures.exists("vannesaPortrait")){this.add.image(675,235,"vannesaPortrait").setDisplaySize(146,146).setDepth(3);this.add.rectangle(675,235,154,154,0xffffff,0).setStrokeStyle(3,0xf0bad2).setDepth(4)}else this.add.image(675,235,"vannesa_idle").setScale(1.575);',
  "Retrato HD de VANNESA en selección");

// Global audio state now retains the currently playing Phaser sound.
game = replaceOnce(game,
  'const audio={ctx:null,music:safeGet("kol_music","1")==="1",sfx:safeGet("kol_sfx","1")==="1",musicVolume:Math.max(0,Math.min(1,Number(safeGet("kol_music_volume","0.65"))||0)),sfxVolume:Math.max(0,Math.min(1,Number(safeGet("kol_sfx_volume","0.8"))||0))};',
  'const audio={ctx:null,track:null,trackKey:"",worldIndex:0,music:safeGet("kol_music","1")==="1",sfx:safeGet("kol_sfx","1")==="1",musicVolume:Math.max(0,Math.min(1,Number(safeGet("kol_music_volume","0.65"))||0)),sfxVolume:Math.max(0,Math.min(1,Number(safeGet("kol_sfx_volume","0.8"))||0))};',
  "Gestión global de audio");

const oldMusic = `  function startMusic(scene,worldIndex){
    audio.music=safeGet("kol_music","1")==="1";if(!audio.music)return;
    const melodies=[[392,494,587,494,440,523,659,523],[330,392,494,392,349,440,523,440],[392,440,523,659,587,523,440,392],[294,370,440,370,262,330,392,330],[440,523,659,784,659,587,523,440]];
    const seq=melodies[worldIndex%melodies.length];let n=0;
    scene.time.addEvent({delay:340,loop:true,callback:()=>{if(audio.music){playTone(seq[n%seq.length],.19,"triangle",.018,"music");n++}}});
  }`;
const newMusic = `  function startMusic(scene,worldIndex){
    audio.music=safeGet("kol_music","1")==="1";
    audio.worldIndex=Math.max(0,Math.min(4,Number(worldIndex)||0));
    if(!audio.music){if(audio.track&&audio.track.isPlaying)audio.track.stop();return}
    const key="auralia_world_"+audio.worldIndex;
    if(!scene||!scene.sound||!scene.cache||!scene.cache.audio||!scene.cache.audio.exists(key)){console.warn("Auralia: falta la pista de música",key);return}
    if(audio.track&&audio.trackKey===key){audio.track.setVolume(audio.musicVolume);if(!audio.track.isPlaying){if(scene.sound.locked){const same=audio.track;scene.sound.once("unlocked",()=>{if(audio.music&&audio.track===same&&!same.isPlaying)same.play()})}else audio.track.play()}return}
    if(audio.track){try{audio.track.stop();audio.track.destroy()}catch(_){}}
    const track=scene.sound.add(key,{loop:true,volume:audio.musicVolume});audio.track=track;audio.trackKey=key;
    if(scene.sound.locked){scene.sound.once("unlocked",()=>{if(audio.music&&audio.track===track&&!track.isPlaying)track.play()})}else track.play();
  }`;
game = replaceOnce(game, oldMusic, newMusic, "Reproductor de música regional");

// The Options toggle must stop/resume the actual soundtrack, not merely its old oscillator.
game = replaceOnce(game,
  'this.musicText.on("pointerdown",()=>{const next=safeGet("kol_music","1")==="1"?"0":"1";safeSet("kol_music",next);audio.music=next==="1";this.musicText.setText("MÚSICA: "+(next==="1"?"ACTIVADA":"DESACTIVADA"))});',
  'this.musicText.on("pointerdown",()=>{const next=safeGet("kol_music","1")==="1"?"0":"1";safeSet("kol_music",next);audio.music=next==="1";if(audio.music)startMusic(this,audio.worldIndex||0);else if(audio.track&&audio.track.isPlaying)audio.track.stop();this.musicText.setText("MÚSICA: "+(next==="1"?"ACTIVADA":"DESACTIVADA"))});',
  "Interruptor de música");

game = replaceOnce(game,
  'label.setText((channel==="music"?"VOLUMEN DE MÚSICA: ":"VOLUMEN DE EFECTOS: ")+Math.round(audio[key]*100)+"%");\n      playTone(channel==="music"?660:440,.08,"sine",.05,channel);',
  'label.setText((channel==="music"?"VOLUMEN DE MÚSICA: ":"VOLUMEN DE EFECTOS: ")+Math.round(audio[key]*100)+"%");\n      if(channel==="music"&&audio.track)audio.track.setVolume(audio.musicVolume);\n      playTone(channel==="music"?660:440,.08,"sine",.05,channel);',
  "Control de volumen de música");

// Add the panoramic Valley artwork as a real Prologue scene background.
game = replaceOnce(game,
  'const bg=this.add.graphics();bg.fillGradientStyle(0x17243d,0x17243d,0x4d5976,0x263a4b,1);bg.fillRect(0,0,W,H);\n      const moon=this.add.circle(760,128,88,0xf3dca2,.12);',
  'const bg=this.add.graphics();bg.fillGradientStyle(0x17243d,0x17243d,0x4d5976,0x263a4b,1);bg.fillRect(0,0,W,H);\n      if(this.textures.exists("valleyIntroRemaster"))this.add.image(W/2,H/2,"valleyIntroRemaster").setDisplaySize(W,H).setAlpha(.50);\n      this.add.rectangle(W/2,H/2,W,H,0x111629,.30);\n      const moon=this.add.circle(760,128,88,0xf3dca2,.12);',
  "Fondo cinematográfico del prólogo");

// Create a short landing pose, dedicated running cycles and a resonant response.
game = replaceOnce(game,
  'this.resonanceCooldown=this.time.now+1000;bell.destroy();this.resonanceCount++;this.score+=250;',
  'this.resonanceCooldown=this.time.now+1000;this.resonanceUntil=this.time.now+440;bell.destroy();this.resonanceCount++;this.score+=250;',
  "Estado de animación de resonancia");
const oldPose = 'const groundedNow=this.player.body.blocked.down||this.player.body.touching.down;\n      let pose="idle";\n      if(this.invulnerable>0)pose="hurt";else if(time<(this.attackUntil||0))pose=this.role==="VANNESA"?"cast":"attack";else if(!groundedNow)pose=this.player.body.velocity.y<0?"jump":"fall";else if(Math.abs(this.player.body.velocity.x)>20)pose=(Math.floor(time/(run?85:135))%2===0?"walk1":"walk2");';
const newPose = 'const groundedNow=this.player.body.blocked.down||this.player.body.touching.down;\n      if(groundedNow&&!this.wasGrounded)this.landUntil=time+135;\n      this.wasGrounded=groundedNow;\n      let pose="idle";\n      if(this.invulnerable>0)pose="hurt";else if(time<(this.resonanceUntil||0))pose="resonance";else if(time<(this.attackUntil||0))pose=this.role==="VANNESA"?"special":"attack";else if(time<(this.landUntil||0))pose="land";else if(!groundedNow)pose=this.player.body.velocity.y<0?"jump":"fall";else if(Math.abs(this.player.body.velocity.x)>20){const frame=Math.floor(time/(run?92:135))%2;pose=run?(frame===0?"run1":"run2"):(frame===0?"walk1":"walk2")}';
game = replaceOnce(game, oldPose, newPose, "Animación ampliada de protagonistas");

// Replace social-sharing placeholders with the actual GitHub Pages address.
const liveUrl = "https://serranoandresf.github.io/the-kingdom-of-love/";
index = index.replaceAll("https://TU-USUARIO.github.io/TU-REPOSITORIO/", liveUrl);
index = index.replaceAll("https://TU-USUARIO.github.io/TU-REPOSITORIO/assets/share/og-cover.jpg", liveUrl + "assets/share/auralia-remaster-promo.jpg");
index = index.replace(/<meta property="og:image" content="[^"]+">/, `<meta property="og:image" content="${liveUrl}assets/share/auralia-remaster-promo.jpg">`);
index = index.replace(/<meta property="og:image:secure_url" content="[^"]+">/, `<meta property="og:image:secure_url" content="${liveUrl}assets/share/auralia-remaster-promo.jpg">`);
index = index.replace(/<meta name="twitter:image" content="[^"]+">/, `<meta name="twitter:image" content="${liveUrl}assets/share/auralia-remaster-promo.jpg">`);
index = index.replace('<!-- Sustituye TU-USUARIO y TU-REPOSITORIO con la URL real de GitHub Pages. -->', '<!-- Canonical URL: GitHub Pages deployment. -->');

// Add new scripts/assets to the service-worker precache and force an update.
sw = sw.replace(/const CACHE_VERSION = "[^"]+";/, 'const CACHE_VERSION = "kol-auralia-remaster-v2-20261124-1";');
const coreMarker = '  "./src/config.js", "./src/data.js", "./src/art.js", "./src/game.js", "./src/pwa.js",';
const coreReplacement = '  "./src/config.js", "./src/data.js", "./src/art.js", "./src/auralia-remaster.js", "./src/auralia-remaster-v2.js", "./src/game.js", "./src/pwa.js",';
sw = replaceOnce(sw, coreMarker, coreReplacement, "Precaché de scripts de remasterización");
sw = replaceOnce(sw,
  '  "./assets/concept/title-screen-concept.webp", "./assets/worlds/valle-de-las-campanas.webp", "./assets/share/og-cover.jpg",',
  '  "./assets/concept/title-screen-concept.webp", "./assets/worlds/valle-de-las-campanas.webp", "./assets/worlds/valle-intro-remaster.webp", "./assets/characters/andres-portrait.webp", "./assets/characters/vannesa-portrait.webp", "./assets/share/og-cover.jpg", "./assets/share/auralia-remaster-promo.jpg",\n  "./assets/audio/auralia-world-0.mp3", "./assets/audio/auralia-world-1.mp3", "./assets/audio/auralia-world-2.mp3", "./assets/audio/auralia-world-3.mp3", "./assets/audio/auralia-world-4.mp3",',
  "Precaché de arte y música");

// Keep local rollback snapshots out of future commits.
if (!gitignore.split(/\r?\n/).includes(".auralia-backups/")) {
  gitignore = gitignore.replace(/\s*$/, "") + "\n\n# Local rollback snapshots created by Auralia installers\n.auralia-backups/\n";
}

// Refine the frame and touch controls without changing gameplay layout.
if (!style.includes("AURALIA DEFINITIVE REMASTER V2")) {
  style += `\n\n/* AURALIA DEFINITIVE REMASTER V2 — refined presentation */\n#game-shell{border:1px solid rgba(226,186,104,.72);border-radius:10px;background:radial-gradient(ellipse at 50% 10%,#24385a 0%,#11182b 72%);box-shadow:0 22px 80px #000b,inset 0 0 0 3px rgba(255,227,164,.06),inset 0 0 36px rgba(10,15,30,.45)}\n#game{background:linear-gradient(135deg,rgba(241,199,119,.035),transparent 28%,rgba(99,122,185,.035) 72%,transparent)}\n.touch-pad button{border:1px solid rgba(255,226,164,.92);background:linear-gradient(145deg,rgba(35,61,100,.94),rgba(13,27,51,.93));color:#fff2d1;text-shadow:0 1px 3px #111;box-shadow:0 5px 18px rgba(0,0,0,.46),inset 0 1px 0 rgba(255,255,255,.16),inset 0 0 0 2px rgba(213,170,93,.12);backdrop-filter:blur(5px)}\n.touch-pad button:active,.touch-pad button.is-pressed{background:linear-gradient(145deg,#f2d18a,#c48a3a);color:#211a2d;box-shadow:0 2px 8px #0008,inset 0 1px 0 #fff7d8}\n@media(prefers-reduced-motion:reduce){.touch-pad button{transition:none!important}}\n`;
}

// Validate all edited JS before any source file is written.
for (const [name, code] of [["src/game.js", game], ["src/auralia-remaster.js", fs.readFileSync(file("src/auralia-remaster.js"), "utf8")], ["src/auralia-remaster-v2.js", fs.readFileSync(file("src/auralia-remaster-v2.js"), "utf8")]]) {
  try { new vm.Script(code, { filename: name }); }
  catch (error) { fail(`Sintaxis inválida en ${name}: ${error.message}`); }
}

const changed = index !== originals.index || game !== originals.game || style !== originals.style || sw !== originals.sw || gitignore !== originals.gitignore;
if (!changed) {
  console.log("Auralia Definitive Remaster V2 ya está instalado. No se requieren cambios.");
  process.exit(0);
}
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = file(path.join(".auralia-backups", `before-remaster-v2-${stamp}`));
fs.mkdirSync(backupDir, { recursive: true });
for (const [name, data] of Object.entries(originals)) fs.writeFileSync(path.join(backupDir, name), data, "utf8");
fs.writeFileSync(file("index.html"), index, "utf8");
fs.writeFileSync(file("src/game.js"), game, "utf8");
fs.writeFileSync(file("style.css"), style, "utf8");
fs.writeFileSync(file("sw.js"), sw, "utf8");
fs.writeFileSync(file(".gitignore"), gitignore, "utf8");

console.log("\nAURALIA DEFINITIVE REMASTER V2 instalado.");
console.log(`Copia de seguridad: ${path.relative(root, backupDir)}`);
console.log("Incluye: menú principal renovado con seis acciones, pantalla de logros, retratos HD, música original por región, animaciones de 14 estados, atmósferas animadas, prólogo HD y metadatos de WhatsApp corregidos.");
console.log("Valida con: node tools/validate_project.cjs");
console.log("Prueba localmente antes de publicar en GitHub Pages.");
