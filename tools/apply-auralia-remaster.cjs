#!/usr/bin/env node
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const gamePath = path.join(root, "src", "game.js");
const artPath = path.join(root, "src", "art.js");
const remasterPath = path.join(root, "src", "auralia-remaster.js");

function fail(message) { console.error(`\nERROR: ${message}\n`); process.exit(1); }
for (const file of [indexPath, gamePath, artPath, remasterPath]) {
  if (!fs.existsSync(file)) fail(`No se encontró ${path.relative(root, file)}. Ejecuta este instalador desde la copia completa del proyecto Auralia.`);
}

let index = fs.readFileSync(indexPath, "utf8");
let game = fs.readFileSync(gamePath, "utf8");
const originalIndex = index;
const originalGame = game;

if (!index.includes('src="./src/art.js"')) fail("index.html no contiene la etiqueta esperada de src/art.js.");
if (!game.includes("    drawWorld(){") || !game.includes("    buildPlatforms(){")) fail("No se reconoce la estructura drawWorld/buildPlatforms de src/game.js. No se modificó nada.");

if (!index.includes('src="./src/auralia-remaster.js"')) {
  index = index.replace('  <script src="./src/art.js"></script>', '  <script src="./src/art.js"></script>\n  <script src="./src/auralia-remaster.js"></script>');
}

const replacements = [
  ['this.add.image(285,235,"andres_idle").setScale(3.15);', 'this.add.image(285,235,"andres_idle").setScale(1.575);'],
  ['this.add.image(675,235,"vannesa_idle").setScale(3.15);', 'this.add.image(675,235,"vannesa_idle").setScale(1.575);'],
  ['this.add.image(410,260,"andres_idle").setScale(2.4);this.add.image(550,260,"vannesa_idle").setScale(2.4);', 'this.add.image(410,260,"andres_idle").setScale(1.2);this.add.image(550,260,"vannesa_idle").setScale(1.2);'],
  ['this.player.setScale(1.2);', 'this.player.setScale(0.6);'],
  ['this.player.body.setSize(21,39).setOffset(5,7);', 'this.player.body.setSize(42,78).setOffset(10,14);'],
  ['this.add.image(420,320,d.role==="VANNESA"?"vannesa_idle":"andres_idle").setScale(2.3);this.add.image(525,320,d.role==="VANNESA"?"andres_idle":"vannesa_idle").setScale(2.3);', 'this.add.image(420,320,d.role==="VANNESA"?"vannesa_idle":"andres_idle").setScale(1.15);this.add.image(525,320,d.role==="VANNESA"?"andres_idle":"vannesa_idle").setScale(1.15);'],
  ['const a=this.add.image(420,200,"andres_victory").setScale(2.8),v=this.add.image(530,200,"vannesa_victory").setScale(2.8);', 'const a=this.add.image(420,200,"andres_victory").setScale(1.4),v=this.add.image(530,200,"vannesa_victory").setScale(1.4);']
];
for (const [before, after] of replacements) {
  const count = game.split(before).length - 1;
  if (count !== 1 && !game.includes(after)) fail(`Se esperaba encontrar exactamente una vez este fragmento de game.js: ${before.slice(0, 100)} (encontrado: ${count}). No se modificó nada.`);
  if (count === 1) game = game.replace(before, after);
}

if (!game.includes("AURALIA_REMASTER.decorateWorld(this)")) {
  const nextMethod = game.indexOf("    buildPlatforms(){");
  const close = game.lastIndexOf("    }\n", nextMethod);
  if (close < 0) fail("No se pudo localizar el cierre de drawWorld(). No se modificó nada.");
  game = game.slice(0, close) + "      if (window.AURALIA_REMASTER) window.AURALIA_REMASTER.decorateWorld(this);\n" + game.slice(close);
}

if (index === originalIndex && game === originalGame) {
  console.log("Auralia Remaster ya está aplicado. No hay cambios nuevos.");
  process.exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupDir = path.join(root, ".auralia-backups", `before-remaster-${stamp}`);
fs.mkdirSync(backupDir, { recursive: true });
fs.copyFileSync(indexPath, path.join(backupDir, "index.html"));
fs.copyFileSync(gamePath, path.join(backupDir, "game.js"));

// Validate resulting JavaScript before writing.
const vm = require("node:vm");
try { new vm.Script(game, { filename: "src/game.js" }); }
catch (error) { fail(`La validación sintáctica de game.js falló: ${error.message}. Se conservaron intactos los archivos originales.`); }
try { new vm.Script(fs.readFileSync(remasterPath, "utf8"), { filename: "src/auralia-remaster.js" }); }
catch (error) { fail(`La validación sintáctica de auralia-remaster.js falló: ${error.message}.`); }

fs.writeFileSync(indexPath, index, "utf8");
fs.writeFileSync(gamePath, game, "utf8");
console.log("\nAURALIA REMASTER v1 instalado correctamente.");
console.log(`Copia de seguridad: ${path.relative(root, backupDir)}`);
console.log("Cambios: sprites de Andrés y Vannesa a 64x96, escalas y hitbox ajustadas, decoración ambiental por región.");
console.log("Siguiente paso: ejecuta node tools/validate_project.cjs y prueba el primer capítulo en el navegador.");
