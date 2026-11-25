# Registro de pruebas — AURALIA Definitive

Fecha de revisión: 24 de noviembre de 2026. Rama: remaster/auralia-definitive. No se publicaron cambios.

## Navegador local real

| Prueba | Resultado | Evidencia/alcance |
|---|---|---|
| Portada y recursos HTTP | PASÓ | 200 antes de abrir navegador en la ejecución previa. |
| Phaser real | PASÓ | Phaser 3.80.1 en WebGL dentro del navegador. |
| Inicio desde menú y elección de Andrés | PASÓ | Se inició el capítulo del Valle. |
| Movimiento horizontal/cámara | PASÓ | Se observó desplazamiento del personaje y seguimiento lateral. |
| PNG del tileset del personaje | PASÓ | Ambas hojas PNG observadas en recursos cargados. |
| Apariencia de Andrés/VANNESA en el nivel | PASÓ | Capturas del gameplay real mostraron ambas hojas sin fondo negro en VANNESA. |
| Selección de VANNESA | PASÓ | La selección abrió el Valle con el HUD mostrando VANNESA. |
| Consola en la sesión de las hojas nuevas | PASÓ | Sin registros error/warning al consultar la consola. |
| Vista de avatar/arte | PARCIAL | Mejoró frente a formas procedurales, pero son poses de una referencia 4 × 3 y no una hoja maestra recién aprobada. |

## Verificaciones anteriores de la versión local

Una sesión local previa observó guardado tras recarga, elección de ambos protagonistas, proyectil de VANNESA y activación de resonancia. Esa sesión usó una caché previa, así que no sustituye la repetición con la compilación actual. En el flujo de captura aislado apareció además un error de instrumentación MutationObserver de la página contenedora; no apareció en la consola de la sesión de juego principal.

## No verificado

- Ataque de Andrés alcanzando y derrotando un enemigo.
- Salto, control de altura, aterrizaje y colisiones de todas las plataformas con los sprites nuevos.
- Ataque/proyectil de VANNESA impactando enemigo.
- Resonancia y puente con la versión actual.
- Checkpoints, reinicio, final de capítulo y guardado/recarga en esta versión actual.
- Recorrido continuo del primer capítulo de principio a fin.
- Controles en un viewport móvil realista, paisaje y retrato.
- Audio en dispositivos y tras pausa/reanudación.
- Rendimiento de GPU/memoria, FPS y navegador móvil físico.

## Validación de código

node tools/validate_project.cjs: PASÓ. La salida del validador describe Phaser simulado y no acredita gameplay; la prueba de carga/render se registra por separado arriba.

## Capturas

Capturas PNG de 960 × 540 guardadas y reabiertas para inspección: QA_CAPTURAS/capitulo-1-andres.png y QA_CAPTURAS/capitulo-1-vannesa.png. Se generaron desde Phaser Renderer.snapshot para evitar el buffer WebGL vacío y se verificaron visualmente.

## Actualización de pruebas de personaje — 24-11-2026

La sesión real abierta en la URL de captura QA inició VANNESA en `ref-vannesa-idle`, textura `vannesaGameplaySheet`, cuerpo Arcade efectivo 25,2 × 46,8 y posición de suelo consistente. Las verificaciones de movimiento/salto/ataque de la sesión anterior se describen arriba y son evidencia acotada a esa sesión; este snapshot no acredita todos los estados del encargo. Se reforzó el validador para comprobar el mapa de ataque de VANNESA, dimensiones/origen y transición de final de capítulo. `node tools/validate_project.cjs` se vuelve a ejecutar al cerrar esta revisión.

Capturas disponibles: gameplay inicial de ambos personajes a 960 × 540 y contactos numerados. Aún no hay capturas reproducibles y separadas para cada uno de los diez estados por personaje, ni secuencias temporizadas que prueben continuidad de todos sus cuadros. No se afirma que esos estados estén aprobados.

## Ejecución real adicional — 24-11-2026

Servidor local: puerto 8775, respuesta HTTP 200 para el panel QA; el panel cargó en una pestaña nueva sin heredar el Service Worker del origen 8774. Phaser se identificó como WebGL. El inspector del runtime confirmó `valleyProductionTiles`: 24 cuadros, hojas PNG de ambos protagonistas y música de capítulo cargadas. Seleccionar a ambos mediante el panel abrió el capítulo con sus texturas respectivas.

Con entradas de teclado en canvas y lectura del estado runtime se observaron para Andrés: `ref-andres-walk`, `ref-andres-run`, `ref-andres-attack`, `ref-andres-jump` y regreso a `ref-andres-idle` en el suelo. Para VANNESA se observó `ref-vannesa-special` en cuadros 8 y 9; tras correr a x≈831, E activó `ref-vannesa-resonance`. En las muestras el cuerpo permaneció 25,2 × 46,8. La sesión no demuestra impactos contra enemigos, daño real, recorrido total ni paso natural del final.

El registro de consola del navegador incluye errores `MutationObserver.observe: parameter 1 is not of type Node` que aparecen al usar el arnés de automatización/observación. No se ha podido atribuir ese mensaje al código del juego; el inspector de Phaser no reportó errores de carga/animación y no aparecieron warnings del juego en la sesión. Mantenerlo como una anomalía de arnés por aislar, no contabilizar como cero errores de consola.

Revisión de capturas reales 960 × 540: la panorámica pintada llena casi toda la escena, reduce al protagonista frente al paisaje y hace que el suelo/plataformas, algunos hitos y el resonador se lean como piezas aisladas o bloques simples. Las capturas documentan carga, no alcanzan calidad final. Están en `QA_CAPTURAS/capitulo-1-andres.png`, `capitulo-1-vannesa.png` y las nuevas muestras de reposo dentro de `QA_CAPTURAS/personajes/`.

Se ajustó el tiempo de combate en `src/game.js`: preparación corta de 82 ms antes de spawn del proyectil de VANNESA y antes de resolver el golpe de Andrés, orientados al frame de acción 9. Compensar nuevas duraciones al producir la animación maestra; ahora se trata de una aproximación limitada por la tasa/cuadros de referencia.

Corrección del registro anterior: el párrafo de prueba 82 ms describe la implementación previa y quedó obsoleto. La implementación actual ya no usa ese tiempo fijo; el impacto se produce al recibir `animationupdate` para el marcador del segundo cuadro y la recuperación comienza en `animationcomplete`. La repetición en navegador real confirmó `lastAction.hitSequenceIndex=2`, `hitTextureFrame=9`, impacto de Andrés y creación de proyectil de VANNESA; el valor 1 era el índice Phaser incorrecto.

## Informes y contactos corregidos

El generador reproducible de auditoría es `tools/audit-character-sheets.cjs`. Salidas: `QA_CAPTURAS/auditoria-limites-spritesheets.md` y `.json`; los contactos SVG conservan el atlas tal cual y dibujan bordes rojos en cuadros 09/10 para hacer evidente el derrame, sin tocar los PNG ni el WebP fuente. El informe detecta también solapamiento alfa de borde coincidente (87 filas Andrés; 63 VANNESA) y diferencias del límite inferior que deben interpretarse con cautela porque puede ser cabello/efectos/pose.

La comparación de cámara se hizo con el Phaser real desde el panel QA en 960×540 y quedó almacenada como PNGs de zoom 1.00/1.15. Se selecciona base 1.00× por HUD no recortado; el cambio no altera la escala de mundo a producción.

## Verificación ejecutada en esta revisión — 24-11-2026

- Servidor QA del proyecto (`tools/export-character-sheets.cjs`, 127.0.0.1:8783): HTTP 200 para el panel; HTTP 200 y `image/svg+xml` para el tileset antes de abrir la pestaña.
- Navegador Playwright real, Phaser 3.80.1, Renderer WebGL: el runtime listó 24 frames de `valleyProductionTiles`, los dos PNG de personaje y `auralia_world_0` cargados. Las texturas de jugador fueron `andresGameplaySheet` y `vannesaGameplaySheet`; hitbox Arcade estable: 25,2 × 46,8.
- Andrés: al pulsar F se observó `lastAction.phase=complete`, `hitSequenceIndex=2`, `hitTextureFrame=9`, `impactApplied=true`. El ciclo expone el índice Phaser 1 para atlas 8 y el índice 2 para atlas 9. El marcador anterior (índice 1) fue detectado en runtime como incorrecto y corregido.
- VANNESA: F acabó en `phase=complete`, índice 2 / atlas 9, impacto aplicado, `projectileCreated=true` y `projectileLaunchCount=1`.
- VANNESA: D desplazó el cuerpo de x=100 a x≈267 con entrada combinada de marcha/carrera; Espacio mostró `ref-vannesa-jump` y elevación vertical observada. Esto no sustituye una tabla exhaustiva de aterrizajes/plataformas.
- Persistencia: el registro `kol_save_v2` guardó versión 2, capítulo 0 y rol VANNESA; tras recargar la página en el mismo origen, el mismo contenido siguió disponible. La observación valida persistencia del navegador de prueba, no una matriz de navegadores/dispositivos.
- Capturas Renderer.snapshot 960 × 540, guardadas en `QA_CAPTURAS/qa-andres-gameplay.png` y `QA_CAPTURAS/qa-vannesa-gameplay.png`, revisadas visualmente. El nivel muestra una franja narrativa grande sobre el juego; la escala del héroe y modularidad del suelo siguen siendo bloqueadores visuales.
- Se modificó el panel QA para mantener controles desactivados hasta tener WebGL, atlas y pista listos y para esperar una animación activa y dos requestAnimationFrame antes de guardar. La sesión confirmó que los botones pasan de disabled a enabled cuando los cinco recursos reportados cargaron y ambos PNG volvieron a exportarse.
- Consola: apareció `MutationObserver.observe: parameter 1 is not of type Node` en el tab de juego. También apareció un error JavaScript en la pestaña del SVG estático (sin scripts del proyecto), por lo que el mensaje no se atribuye al runtime Phaser. Queda como anomalía del observador/automatización por aislar; no se informa “cero errores de consola”. No aparecieron mensajes atribuidos al código del juego.
- El intento de viewport 390 × 844 no modificó la medida real reportada (1265 × 720); no hay resultado válido de QA móvil en esta sesión.

## Límites que mantienen el capítulo sin aprobación final

No se completó la partida de principio a fin, el final de capítulo ni el impacto de Andrés/VANNESA contra un enemigo real; tampoco se validaron las colisiones de todas las plataformas, caída/respawn, checkpoint, controles táctiles o móvil físico. Las acciones están sincronizadas con el segundo de los dos cuadros de referencia disponibles; son dos cuadros de acción, no animación artesanal frame-by-frame de producción. El capítulo permanece en estado de prototipo funcional y no se declara aceptado.

Los detalles y el criterio artístico de sustitución siguen en [AUDITORIA_PRODUCCION_AURALIA.md](AUDITORIA_PRODUCCION_AURALIA.md), [PERSONAJES_MAESTROS_AURALIA.md](PERSONAJES_MAESTROS_AURALIA.md) y [REGISTRO_PENDIENTES_AURALIA.md](REGISTRO_PENDIENTES_AURALIA.md).

## Corrección de composición de entrada — 24-11-2026

El mensaje de inicio de juego se acortó a `VALLE DE LAS CAMPANAS · NIVEL 1`, dejando el párrafo narrativo en la introducción previa y sin tapar el plano jugable. Confirmado con servidor local/origen limpio y Phaser WebGL; capturas Renderer.snapshot actualizadas en `QA_CAPTURAS/qa-andres-gameplay.png` y `QA_CAPTURAS/qa-vannesa-gameplay.png`. Queda pendiente revisar el formato de los demás mensajes de tutorial/toast, HUD, paneles táctiles y vista móvil.

## Aceptación funcional del Valle — sesión aislada 24-11-2026

Rama `remaster/auralia-definitive`; servidor local 127.0.0.1:8787, arnés `tools/capture-gameplay.html`, Phaser 3.80.1/WebGL. Origen de navegador aislado y sin borrado de datos. El nivel jugable de capítulo 1 es `levelIndex=0`, `stage=0`, longitud 3000; el índice 2 es el final del mundo Valle y contiene el encuentro guardián, pero no pertenece al capítulo 1 descrito como “Valle de las Campanas”.

Ruta según datos: aparición x=100 sobre suelo continuo; plataformas estáticas centradas en x=340, 610, 865, 1130, 1430, 1690, 2010 y 2310; una móvil (x=740, rango 680–840); bloques rompibles x=970, 1510 y 2140; slimes en x=510, 1080, 1580 y 2170; cinco grupos de monedas (30 total), dos corazones, resonador x=900, secreto x=1510, estrella x=2520, checkpoints x=1200/2180 y portal x=2915. Sin trampas ni guardián. La salida debe guardar `level=1` y pasar a `Intermission` tras 750 ms. Esta inspección de datos no demuestra el recorrido.

En Phaser real ambos inicios cargaron WebGL, tileset Valle de 24 cuadros, hojas de ambos personajes y música; cuerpo del jugador 25,2 × 46,8. Los cuatro slimes se mantuvieron en y≈447 con `bottomBlocked=true`. Se corrigió su spawn de `FLOOR-23` a `FLOOR-44` tras reproducir que aparecían bajo el suelo.

| Prueba | Andrés | VANNESA |
|---|---|---|
| Inicio | PASS — x=100, 3 vidas, suelo y hoja cargada | PASS — estado leído por inspector en x=100, 3 vidas, suelo y hoja cargada |
| Movimiento | PASS — caminó y recogió monedas | PASS — caminata visible |
| Salto | NOT VERIFIED — no quedó muestra concluyente | PASS — Espacio, `jumpCount=1`, `vy<0`, `ref-vannesa-jump` |
| Colisiones | FAIL — terminó en contacto letal; plataformas NOT VERIFIED | NOT VERIFIED — suelo observado, plataformas pendientes |
| Ataque | NOT VERIFIED | NOT VERIFIED |
| Derrota de enemigo | NOT VERIFIED — sin impacto/kill observado | NOT VERIFIED — sin impacto de proyectil observado |
| Resonancia | NOT VERIFIED | NOT VERIFIED |
| Checkpoint | NOT VERIFIED | NOT VERIFIED |
| Recarga | NOT VERIFIED en origen de prueba | NOT VERIFIED en origen de prueba |
| Final del capítulo | FAIL — GameOver antes de x=550 | NOT VERIFIED — no recorrió la ruta |

Fallo observado: Andrés pasó de 3 a 0 vidas; `lastDamage.source="enemy-contact"`, vidas 1→0, checkpoint=100 y escena `GameOver`, sin `lastEnemyHit` ni enemigo derrotado. El intento no progresó; requiere repetición temporizada antes de atribuirlo al balance. No se cambió el daño. VANNESA sí saltó, pero el estado siguiente observado fue suelo en x≈283, no aterrizaje confirmado sobre la primera plataforma.

Capturas Renderer.snapshot: `QA_CAPTURAS/aceptacion/andres-initial.png` muestra el inicio del nivel (1366×768). `QA_CAPTURAS/diagnostico/vannesa-gameover-captura-invalida.png` existe, pero la inspección visual la muestra como pantalla GameOver con puntuación 350, no como inicio de VANNESA; queda invalidada como evidencia inicial y se conserva sin sobrescribir. `QA_CAPTURAS/aceptacion/andres-combat.png` muestra a Andrés en el nivel con 1 vida y un slime delante, pero no muestra ni demuestra un impacto/derrota y no cuenta como captura de combate aceptada. No existen capturas válidas de resonancia, checkpoint o final. Ninguno completó el capítulo.

Viewports efectivos: 1920×1080, 1366×768, 960×540, 390×844 y 844×390; todos coincidieron con el solicitado. `#touch-controls` fue `display:none` en los cinco. Emulación/interacción táctil y teléfono físico quedan NOT VERIFIED.

Consola: la última muestra `dev.logs()` mostró solo la traza informativa Phaser, sin errores/warnings. `rg` no encuentra `MutationObserver` en código del proyecto; el registro histórico también lo observó en página SVG estática sin scripts, lo cual apunta al contenedor/automatización pero no identifica concluyentemente la fuente. Se mantiene sin atribución definitiva.

**Estado: FAIL / INCOMPLETO.** No hubo partida de principio a fin con ninguno. No se hizo commit, push, publicación ni cambio de rama.

## Verificación del panel y del aviso de capítulo

En un origen local sin la caché anterior, el panel mantuvo los controles desactivados mientras faltaban las hojas/música y los habilitó al informar todos los recursos cargados. Exportó ambos PNG QA. El cambio de inicio a una etiqueta breve fue visible en el gameplay y se guardaron las capturas revisadas. El SW se versionó como `kol-auralia-definitive-ch1-20261124-9` para que el cliente solicite esta revisión.
