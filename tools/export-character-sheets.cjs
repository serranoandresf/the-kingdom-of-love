"use strict";

// Local, one-purpose exporter for the supplied 4x3 character reference sheets.
// It only writes the two explicit gameplay-sheet destinations below.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const destinations = {
  andres: path.join(root, "assets/characters/andres-gameplay-sheet.png"),
  vannesa: path.join(root, "assets/characters/vannesa-gameplay-sheet.png")
};
const captures = {
  andres: path.join(root, "QA_CAPTURAS/capitulo-1-andres.png"),
  vannesa: path.join(root, "QA_CAPTURAS/capitulo-1-vannesa.png"),
  "composition-zoom-100": path.join(root, "QA_CAPTURAS/composicion-valle-zoom-100.png"),
  "composition-zoom-115": path.join(root, "QA_CAPTURAS/composicion-valle-zoom-115.png"),
  "qa-andres-gameplay": path.join(root, "QA_CAPTURAS/qa-andres-gameplay.png"),
  "qa-vannesa-gameplay": path.join(root, "QA_CAPTURAS/qa-vannesa-gameplay.png"),
  ...Object.fromEntries(["andres","vannesa"].flatMap(role=>["initial","combat","resonance","checkpoint","complete"].map(state=>[`acceptance-${role}-${state}`,path.join(root,`QA_CAPTURAS/aceptacion/${role}-${state}.png`)])))
};
const captureStates = new Set(["idle", "walk", "run", "jump", "fall", "land", "attack", "special", "resonance", "hurt", "victory"]);
const mime = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".mp3": "audio/mpeg", ".webmanifest": "application/manifest+json", ".json": "application/json" };
const server = http.createServer((req, res) => {
  if (req.method === "POST" && (req.url?.startsWith("/export/") || req.url?.startsWith("/capture/"))) {
    const isCapture = req.url.startsWith("/capture/");
    const key = req.url.slice(isCapture ? "/capture/".length : "/export/".length);
    let target = (isCapture ? captures : destinations)[key];
    if (isCapture && !target) {
      const match = /^(andres|vannesa)-(idle|walk|run|jump|fall|land|attack|special|resonance|hurt|victory)-f([0-9]{1,2})$/.exec(key);
      if (match && captureStates.has(match[2]) && Number(match[3]) < 12) target = path.join(root, "QA_CAPTURAS", "personajes", `${match[1]}-${match[2]}-f${match[3]}.png`);
    }
    if (!target) { res.writeHead(404); res.end("Unknown character"); return; }
    let body = "";
    req.setEncoding("utf8");
    req.on("data", chunk => { body += chunk; if (body.length > 12_000_000) req.destroy(); });
    req.on("end", () => {
      const match = /^data:image\/png;base64,([A-Za-z0-9+/=]+)$/.exec(body);
      if (!match) { res.writeHead(400); res.end("Expected PNG data URL"); return; }
      const png = Buffer.from(match[1], "base64");
      if (png.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") { res.writeHead(400); res.end("Invalid PNG signature"); return; }
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, png, { flag: "w" });
      res.writeHead(201, { "content-type": "application/json" });
      res.end(JSON.stringify({ saved: path.relative(root, target), bytes: png.length }));
    });
    return;
  }
  const pathname = req.url === "/" ? "/tools/prepare-character-sheets.html" : decodeURIComponent((req.url || "").split("?")[0]);
  const target = path.resolve(root, "." + pathname);
  if (!target.startsWith(root + path.sep) || !fs.existsSync(target) || !fs.statSync(target).isFile()) { res.writeHead(404); res.end("Not found"); return; }
  res.writeHead(200, { "content-type": mime[path.extname(target)] || "application/octet-stream", "cache-control": "no-store" });
  fs.createReadStream(target).pipe(res);
});
const port = Number(process.env.AURALIA_EXPORT_PORT || 8774);
server.listen(port, "127.0.0.1", () => console.log("Auralia local asset QA server listening on http://127.0.0.1:" + port + "/"));
