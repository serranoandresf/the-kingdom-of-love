const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const raw = process.argv[2];
if (!raw) {
  console.error("Uso: node tools/set-github-pages-url.cjs https://USUARIO.github.io/REPOSITORIO/");
  process.exit(2);
}
let url;
try { url = new URL(raw); } catch (_) {
  console.error("La URL no es válida."); process.exit(2);
}
if (url.protocol !== "https:") {
  console.error("GitHub Pages debe publicarse mediante HTTPS."); process.exit(2);
}
const base = url.origin + (url.pathname.endsWith("/") ? url.pathname : url.pathname + "/");
const imageUrl = new URL("assets/share/og-cover.jpg", base).href;
const indexPath = path.join(root, "index.html");
let html = fs.readFileSync(indexPath, "utf8");
html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${base}$2`);
html = html.replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${base}$2`);
html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${imageUrl}$2`);
html = html.replace(/(<meta property="og:image:secure_url" content=")[^"]*(")/, `$1${imageUrl}$2`);
html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${imageUrl}$2`);
fs.writeFileSync(indexPath, html, "utf8");
console.log("URL de GitHub Pages configurada:", base);
console.log("Imagen para vista previa:", imageUrl);
console.log("Ahora guarda los cambios y vuelve a subirlos a la rama main.");
