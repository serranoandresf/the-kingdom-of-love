# Informe de validación — V5 Auralia / GitHub Pages

Fecha de preparación: 24 de noviembre de 2026.

## Resultado estructural

- JavaScript (`src/config.js`, `src/data.js`, `src/art.js`, `src/game.js`, `src/pwa.js`, herramientas y Service Worker): `node --check` sin errores.
- Datos: 5 regiones, 15 capítulos, 5 guardianes y 15 resonadores validados.
- Cada capítulo tiene su propio texto narrativo y una posición válida del resonador.
- El resonador de cada capítulo de guardián se ubica dentro de su arena, a 80 px del punto inicial del guardián.
- Recursos enlazados desde `index.html` comprobados en el paquete.
- Manifiesto PWA y recursos del Service Worker comprobados.
- Open Graph/Twitter: metadatos presentes; el dominio real queda pendiente de la URL del repositorio.
- GitHub Pages: workflow con permisos `pages: write` e `id-token: write` y acciones de publicación revisadas.
- ZIP de entrega: `index.html` en la raíz y sin carpeta duplicada.

## Comprobación de escena

El punto de entrada de `src/game.js` se evaluó con un contenedor mínimo de Phaser simulado para comprobar la declaración y el ensamblaje de escenas. Esto no ejecuta el motor real ni valida física, renderizado o una partida completa.

## Limitaciones observadas

- La sesión anterior tuvo un timeout de red local; se resolvió al usar servidor en loopback en puerto disponible y comprobar HTTP 200 antes del navegador. Phaser 3.80.1/WebGL abrió en navegador real.
- No se recorrieron manualmente los quince capítulos.
- No se probaron teléfonos físicos Android o iPhone.
- Las hojas de gameplay de Andrés y VANNESA se recortaron de las referencias locales y ya se integran en el capítulo. Son 12 poses, con ciclos para idle/caminar/correr y ataque de Andrés; siguen pendientes hojas maestras y más ciclos de estados.
- El arte de fondo dedicado y el menú nuevo están integrados para Auralia/Valle; las otras cuatro regiones aún requieren fondos de producción propios.
- La URL pública no puede fijarse hasta que el propietario cree el repositorio y GitHub Pages asigne el dominio.

## Estado

**V5: vertical slice conceptual y mecánica de Auralia implementadas en la base existente; lista para subir a un repositorio GitHub y continuar el ciclo de pruebas. No es todavía un lanzamiento comercial verificado.**

## Revisión de navegador — capítulo 1 (24 nov 2026)

- Servidor de desarrollo: `127.0.0.1:8771`; HTTP 200 comprobado en `/`, `/src/game.js` y `/assets/worlds/valle-capitulo-1-tileset.svg` antes de abrir el navegador.
- Navegador real: Phaser 3.80.1, WebGL. Se inició partida, se seleccionó Andrés y se observó movimiento con desplazamiento de cámara.
- La página registró el tileset SVG como recurso de imagen cargado. Consola sin errores/advertencias en la sesión observada.
- La suite `node tools/validate_project.cjs` pasó, pero su propia salida aclara que Phaser fue simulado.
- La revisión manual previa de la versión V2 comprobó selección de ambos protagonistas, recarga/continuación con progreso guardado, disparo de VANNESA y activación del resonador. El ataque de Andrés contra enemigo, el recorrido completo y la prueba móvil no quedaron demostrados en esta verificación.
- No se afirma que el capítulo funcione de principio a fin ni que alcance calidad de producción. El fondo aún se percibe como panorámica, las poses de personaje proceden de una hoja de referencia y enemigos/plataformas/efectos requieren una pasada de arte y prueba.
- Capturas reales verificadas en QA_CAPTURAS/capitulo-1-andres.png y QA_CAPTURAS/capitulo-1-vannesa.png (PNG 960 × 540, generados por el snapshot del renderer Phaser).

**Estado de aceptación del capítulo 1: incompleto.** Prioridades de arte y límites están detallados en `AUDITORIA_PRODUCCION_AURALIA.md`.

## Mejora de personajes — navegador real

- Dos hojas PNG RGBA de 1024 × 684 (4 × 3 cuadros de 256 × 228) creadas a partir de las referencias existentes; las fuentes no se modificaron.
- Ambos personajes se eligieron en la UI y aparecieron en el Valle con la nueva hoja. Phaser cargó el SVG de Valle y ambos PNG. Consola sin error/warning.
- La colisión se reexpresó para la escala del nuevo arte manteniendo el tamaño efectivo: 25,2 × 46,8. Su precisión aún no se comprobó en recorrido.
- El validador pasa, incluida la firma, dimensiones, canal alfa y precarga PWA de cada hoja. Esto verifica archivos y no equivale a prueba de colisión o capítulo completo.
- Capturas PNG de gameplay comprobadas: QA_CAPTURAS/capitulo-1-andres.png y QA_CAPTURAS/capitulo-1-vannesa.png.
- VÉASE: DIRECCION_ARTISTICA_AURALIA.md, CONVENCIONES_SPRITESHEETS.md, INVENTARIO_ASSETS_AURALIA.md, REGISTRO_PRUEBAS_AURALIA.md y REGISTRO_PENDIENTES_AURALIA.md.

## Acceptance update — Valle de las Campanas (24 Nov 2026)

**Acceptance status: FAIL / NOT COMPLETE.** Current branch remains `remaster/auralia-definitive`; no commit, push, or publication.

Fresh local-origin browser evidence: Phaser 3.80.1 WebGL loaded the 24-frame valley tileset, both character sheets, and chapter music. Effective player body remained 25.2×46.8; all four slime bodies were grounded after the spawn correction. Andrés reached GameOver from `enemy-contact` before x=550/checkpoint, with no enemy kill recorded. VANNESA walked and produced a real jump (`vy<0`); platform landing was not established. Neither completed the route.

The requested chapter is level index 0 (3000 units): eight static platforms, one moving platform, four slimes, 30 coins, two hearts, resonator, secret, star, two checkpoints and portal. No traps or guardian. Expected portal behavior is saving level 1 and opening Intermission; it was not reached.

Effective viewport sizes matched all five requests: 1920×1080, 1366×768, 960×540, 390×844, 844×390. Touch controls were `display:none` at each; touch emulation and physical phones remain unverified. Latest console sample contained only Phaser's informational startup line. Project source has no `MutationObserver` reference; a prior static-page occurrence suggests automation/container origin, but attribution is inconclusive.

`QA_CAPTURAS/aceptacion/andres-initial.png` shows the true initial scene. The file `vannesa-initial.png` displays GameOver/score 350 despite the inspector having shown VANNESA at start, so that image is invalid as start evidence and was preserved. `andres-combat.png` shows a slime nearby but does not demonstrate a hit or defeat. Valid combat/resonance/checkpoint/completion evidence does not exist. Art remains provisional; full matrix is in `REGISTRO_PRUEBAS_AURALIA.md`.
