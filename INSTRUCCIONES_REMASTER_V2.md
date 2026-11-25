# AURALIA — Definitive Remaster V2

Esta entrega acumula el parche V1 y añade una segunda pasada técnica y audiovisual. Está diseñada para `serranoandresf/the-kingdom-of-love` y no publica cambios automáticamente.

## Incluye

- **Menú principal:** nueva ilustración panorámica con seis opciones funcionales alineadas al arte: Nueva Aventura, Continuar, Opciones, Logros, Créditos y Salir. “Salir” muestra cómo cerrar la pestaña, sin intentar cerrar el navegador.
- **Logros:** nueva crónica con cinco hitos que se marcan según los fragmentos, capítulos, monedas y puntuación guardados.
- **Personajes:** recursos procedurales de 64 × 96 px (2× la resolución original), conservando las claves Phaser. Se amplía a 14 estados visuales: idle, walk1/2, run1/2, jump, fall, land, attack, special, resonance, hurt, victory y cast. El selector incorpora retratos ilustrados de 512 × 512 px para Andrés y VANNESA.
- **Animación:** el gameplay usa ciclos diferenciados de caminar/correr, una breve pose de aterrizaje y una pose específica al activar Resonancia.
- **Atmósfera:** partículas y brillos animados distintos para pradera, bosque, mar, invierno y eclipse. Son decorativos y no tienen cuerpos físicos.
- **Música:** cinco pistas originales sintetizadas por capas, una por región, en MP3 estéreo. La música se carga desde el caché de Phaser, respeta el interruptor y el volumen de Opciones y cambia al cambiar de mundo.
- **Prólogo:** fondo panorámico ilustrado para la introducción del Valle de las Campanas.
- **Compartir:** portada de 1200 × 630 px para WhatsApp/Open Graph y corrección del canonical URL a la página de GitHub Pages real.
- **PWA:** nueva versión del caché y precarga de scripts, ilustración y música nuevos.
- **Interfaz:** acabado adicional del marco del juego y controles táctiles.

## Instalación en Windows

1. Descarga y extrae este ZIP **en la raíz** de la copia completa de Auralia, por ejemplo `C:\Users\serra\Downloads\AURALIA_V5`.
2. Cuando Windows pregunte, permite combinar carpetas y reemplazar los archivos incluidos: los dos módulos de remasterización, la portada `assets/concept/title-screen-concept.webp` y los nuevos recursos de `assets`.
3. Abre PowerShell en esa carpeta.
4. Ejecuta:

```powershell
node .\tools\apply-auralia-remaster-v2.cjs
node .\tools\validate_project.cjs
.\INICIAR_JUEGO.bat
```

El instalador primero prepara la compatibilidad V1 y luego aplica V2. Crea copias de seguridad en `.auralia-backups`, añade esa carpeta a `.gitignore` para que no se publique por accidente y comprueba la sintaxis antes de escribir cambios.

## Publicación en el repositorio oficial

Prueba localmente antes de publicar. Como la carpeta `AURALIA_V5` puede ser una copia extraída y no un clon Git, el paquete incluye un publicador que clona el repositorio correcto (`serranoandresf`), copia los archivos de esta versión, valida y crea el commit:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\PUBLICAR_REMASTER_V2_SERRANO.ps1
```

El script no publica los respaldos `.auralia-backups`, conserva el clon temporal para revisión y envía el commit a `main`. GitHub Actions debe completar el despliegue antes de compartir la página. El script no se ejecuta automáticamente al instalar el parche.

## Control de calidad y límites

- Los sprites de gameplay siguen siendo pixel art dibujado por código, no spritesheets artesanales capturados de las fotografías originales. Los dos retratos del selector son ilustraciones conceptuales generadas a partir de las descripciones disponibles; no son una recreación fiel de las fotografías reales.
- Los 14 estados son texturas de pose que el motor alterna; todavía no equivalen a animación frame-by-frame de un juego comercial.
- Las cinco pistas son composiciones originales sintetizadas y renderizadas a MP3; no son grabaciones de músicos ni una orquesta real.
- La atmósfera añadida es una capa decorativa Phaser; no reemplaza tilesets artesanales de producción ni rediseña todos los quince niveles.
- El prólogo sí incorpora un fondo panorámico nuevo. Los demás mundos mantienen los fondos existentes más sus capas de ambiente V1/V2.
- No se ha ejecutado una prueba real del motor en este entorno ni en teléfonos Android/iPhone. La validación sintáctica no sustituye pruebas de gameplay en navegador.
