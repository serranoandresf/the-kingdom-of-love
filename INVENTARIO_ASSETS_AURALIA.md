# Inventario de assets — AURALIA

Estado del inventario: inspección estática y carga del capítulo 1 en navegador real. “Observado” no significa aprobado para producción.

| Grupo | Recurso | Uso/estado |
|---|---|---|
| Marca | assets/concept/title-screen-concept.webp | Pantalla inicial; arte ilustrado, observado en navegador. |
| Marca | assets/share/auralia-remaster-promo.jpg y og-cover.jpg | Difusión y metadatos; no se usan como escena de gameplay. |
| Personaje | assets/characters/andres-portrait.webp | Retrato de selección; ilustración estática. |
| Personaje | assets/characters/vannesa-portrait.webp | Retrato de selección; ilustración estática. Escritura VANNESA conservada. |
| Personaje | assets/characters/andres-animation-reference.webp | Referencia local con 12 poses, usada para hoja de gameplay. |
| Personaje | assets/characters/vannesa-animation-reference.webp | Referencia local con 12 poses, fondo opaco procesado para transparencia. |
| Personaje | assets/characters/andres-gameplay-sheet.png | PNG RGBA 1024 × 684; hoja derivada de la referencia e integrada en Phaser. |
| Personaje | assets/characters/vannesa-gameplay-sheet.png | PNG RGBA 1024 × 684; hoja derivada de la referencia e integrada en Phaser. |
| Personaje | src/auralia-remaster.js | Respaldo procedural, mapeo de 12 poses, y definición de animaciones Phaser. |
| Valle | assets/worlds/valle-de-las-campanas.webp | Ilustración panorámica usada como capa distante/parallax; no es nivel completo. |
| Valle | assets/worlds/valle-intro-remaster.webp | Arte de introducción narrativa; escena fija. |
| Valle | assets/worlds/valle-capitulo-1-tileset.svg | Atlas SVG modular de 24 celdas 48 × 48, integrado en suelo, plataformas y hitos. Primera iteración visual. |
| Música | assets/audio/auralia-world-0.mp3 a auralia-world-4.mp3 | Cinco pistas locales, una por mundo, cargadas por el juego. No equivalen a mezcla/foley completo. |
| UI/PWA | assets/icons/icon-192.png, icon-512.png, apple-touch-icon.png, manifest.webmanifest, sw.js | Iconos, instalación y precarga versionada. |
| Enemigos | src/art.js | Texturas de enemigos y guardianes dibujadas por código; no hay hojas animadas de producción para el capítulo. |
| Herramienta | tools/prepare-character-sheets.html, tools/export-character-sheets.cjs y tools/capture-gameplay.html | Herramientas locales para preparar hojas y capturar QA. No participan en runtime. |

## Archivos de ejecución relevantes

- index.html enlaza Phaser, los módulos y controles táctiles.
- src/config.js mantiene valores narrativos personalizables.
- src/data.js contiene cinco mundos, quince niveles, guardianes y resonadores.
- src/game.js define escenas, plataformas, colisiones, habilidad, persistencia y HUD.
- style.css controla contenedor y controles táctiles.

## Riesgos de inventario

- Los nuevos PNG duplican la información visual de las referencias y aumentan la carga de red. La caché PWA los incluye; no se ha medido memoria o rendimiento en móvil físico.
- Las imágenes fuente se conservan intactas. Las hojas de gameplay son recursos derivados y pueden regenerarse con la herramienta local.
- No se ha determinado licencia externa para recursos generados antes de esta tarea; en el proyecto se tratan como material local suministrado. Confirmar procedencia antes de distribución comercial.

## Auditoría detallada de protagonistas — 24-11-2026

Consultar [PERSONAJES_MAESTROS_AURALIA.md](PERSONAJES_MAESTROS_AURALIA.md) para contenido observado por índice, tabla de animaciones, medidas y límites. Los dos atlas RGBA 1024 × 684 son derivados de referencias locales, tienen 12 celdas con alfa y se cargan en Phaser. Los contactos `QA_CAPTURAS/contacto-frames-andres.svg` y `QA_CAPTURAS/contacto-frames-vannesa.svg` permiten leer el orden. El contacto muestra el derrame de efectos entre celdas 9/10; por eso estos PNG sirven para integración/prototipo, no como hojas finales limpias.

## Evidencia de gameplay generada — 24-11-2026

- `QA_CAPTURAS/qa-andres-gameplay.png` y `QA_CAPTURAS/qa-vannesa-gameplay.png`: capturas nuevas de Phaser Renderer.snapshot, 960 × 540, después de que el inspector QA confirmó animación activa. Se separan de las capturas históricas y no se sustituyeron las hojas PNG ni referencias fuente.
- `QA_CAPTURAS/auditoria-limites-spritesheets.md` y `.json`: medidas por celda/alpha y aviso de los cuadros que alcanzan el borde.
- La persistencia en misma sesión de origen se volvió a observar después de recargar página (`kol_save_v2`, nivel 0, rol VANNESA). Esto no mide recuperación luego de borrar almacenamiento ni sincronización entre dispositivos.
- Prueba de acciones en navegador: Andrés impacta en secuencia Phaser 2 / atlas frame 9; VANNESA crea su proyectil en el mismo marcador. El validador local ahora fija esta semántica.
- La consola captura el TypeError de MutationObserver tanto durante juego como en tab SVG estático sin script de aplicación. Queda sin atribución concluyente, separado de los errores Phaser.
- Se intentó viewport 390 × 844; la herramienta conservó 1265 × 720, así que se excluye como prueba responsive.

## Clasificación sin ambigüedad de recursos

Producción observada: ilustraciones de título/retrato/panoramas, música MP3 incorporada, y el atlas de 24 celdas SVG cargado en runtime. “Cargado” no significa arte de gameplay aprobado. Prototipo funcional: hojas PNG de personajes derivadas de referencias (12 celdas; borde alfa fugado en ataques 9/10), escenario del valle compuesto por una panorámica distante y formas de escena, efectos de resonancia con círculos/halos y sonidos sintetizados. Pendiente de producción: arte maestro de protagonistas con continuidad anatómica, ciclos frame-by-frame; tileset de terreno completo y transiciones; capas de fondo reales; diseños/animaciones de enemigos y guardián; VFX y foley; mezcla musical; UI/encuadre móvil.

La panorámica no sustituye recursos modulares en gameplay. No se creó ni se llamó “final” a ningún sprite geométrico. Los dibujos de `src/auralia-remaster.js` son una capa de respaldo; las texturas visibles probadas son las hojas PNG del atlas suministrado.
