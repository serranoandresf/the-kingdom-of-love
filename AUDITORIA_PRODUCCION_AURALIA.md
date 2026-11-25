# Auditoría de producción — AURALIA

Fecha de inspección: 24 de noviembre de 2026. Alcance: versión V5 local, instaladores V1/V2, recursos incluidos y código del juego. La rama de trabajo parte de `main` en `950ce0765c0a9f3e6fa75f215ba08c457402ca91`; no hay cambios publicados.

## Estado por sistema

| Sistema | Recursos y funcionamiento encontrados | Clasificación actual |
|---|---|---|
| Personajes | El módulo conserva avatares procedurales 64 × 96 como respaldo y para pantallas que aún los usan. El juego carga además una hoja 4 × 3 por protagonista, derivada de las referencias ilustradas locales. | El gameplay usa ilustración pixelada de referencia recortada en cuadros independientes. No equivale a un diseño aprobado ni a una hoja dibujada desde cero para producción. |
| Animaciones | Las hojas presentan 12 poses cada una. Phaser reproduce dos cuadros de idle y caminar, cuatro de correr y dos de ataque para Andrés. VANNESA tiene dos de idle y caminar, cuatro de correr, y poses de salto, resonancia, magia, daño y victoria. | La locomoción proviene de ilustraciones con posiciones distintas. Gran parte de los estados aún son poses fijas; faltan ciclos completos de anticipación, impacto, recuperación, caída, aterrizaje y gestos. |
| Escenarios | Valle: dos panorámicas WebP locales, siluetas y capas de ambiente. En el capítulo jugable la panorámica sigue dominando la lectura y el parallax es limitado; los elementos modulares son pocos. Los otros reinos dependen en mayor medida de formas y partículas dibujadas durante la ejecución. | Ilustración de fondo utilizable, pero no sustituye un escenario modular con profundidad de producción. |
| Tilesets | No había tilesets externos de niveles. Esta rama incorpora `assets/worlds/valle-capitulo-1-tileset.svg`: 24 cuadros vectoriales integrados en suelo, plataformas y algunos hitos. | El atlas carga y aparece en el juego, pero es pequeño y varios elementos se escalan mucho. Es una primera iteración, no un tileset de producción completo. |
| Enemigos | Slimes, polillas, hielo, sombras y guardianes usan texturas pixel dibujadas en `src/art.js`; la IA se basa en patrullas y movimiento contextual sencillo. | Prototipos funcionales con identidad visual básica; no hay spritesheets animados ni IA de producción. |
| Guardianes | Cinco texturas temáticas dibujadas en código. El combate contempla vida, fases, movimiento, proyectiles y daño por salto, ataque o resonancia. La arena final está definida en datos. | Lógica jugable con patrones reutilizados y arte estático. Hay que validar dificultad, telegráficos y colisiones en sesiones reales. |
| Física | Phaser Arcade gestiona colisiones, plataformas móviles/frágiles, daño, checkpoints, salto doble de VANNESA y proyectiles. Quince mapas están definidos por coordenadas. | Motor real cargado en navegador. Se observó el desplazamiento del jugador/cámara; dimensiones y precisión de cada plataforma, recorrido completo y balance siguen pendientes de prueba. |
| Sonido | Cinco MP3 locales sintetizados para las regiones, control de música/efectos y tonos generados por osciladores para acciones. | Las pistas musicales son recursos de audio finalizados y utilizables; los efectos de juego siguen siendo tonos de placeholder. |
| Interfaz | Menú ilustrado, selección de protagonistas, pausa, HUD, logros, opciones y botones táctiles. La navegación usa zonas de interacción sobre ilustraciones y texto Phaser. | Flujo funcional, pero no hay suite automatizada de interacción ni verificación de accesibilidad visual completa. |
| Configuración y publicación | `src/config.js` permite personalizar texto y recuerdos; PWA, Service Worker y GitHub Pages están configurados. El workflow de Pages se activa desde `main`. | Configuración usable; el flujo de publicación debe mantenerse fuera de `main` hasta aprobar y revisar la rama. |

## Capítulo 1 — trabajo iniciado y prueba en navegador

- Se creó un tileset vectorial de 24 cuadros: suelo, plataformas, roca, flores, vegetación, faroles, puente, torre de campanas y arco.
- Phaser carga el tileset como spritesheet y lo usa en el suelo y las plataformas físicas del capítulo 1. Las plataformas mantienen su cuerpo de colisión aunque se oculte su textura provisional.
- Se añadieron hitos y vegetación específica del Valle, sin alterar los mapas de otros capítulos.
- Caminar y correr reproducen secuencias de dos cuadros por personaje con el gestor de animaciones de Phaser.
- Las referencias locales se convirtieron en dos PNG RGBA de 1024 × 684: cuadrícula 4 × 3 y cuadros de 256 × 228. El fondo opaco de VANNESA se separa mediante flood fill conectado a los bordes, conservando zonas oscuras encerradas.
- Phaser utiliza las hojas para el avatar de gameplay; origen y escala alinean los pies, y la colisión efectiva se conserva en 25,2 × 46,8 unidades.
- La nueva carga real de ambos PNG y su representación se comprobó con Andrés y VANNESA en el capítulo.
- El nuevo SVG y ambas hojas forman parte del precaché de PWA y las validaciones de recursos.
- Se sirvió el proyecto localmente en `http://127.0.0.1:8771/`; HTTP devolvió 200 para la portada, `src/game.js` y el tileset SVG antes de abrir el navegador.
- Playwright en navegador real ejecutó Phaser 3.80.1 en WebGL. La selección de Andrés y la entrada al Valle se completaron, se vio el movimiento y el seguimiento horizontal de cámara, y el atlas SVG figura entre los recursos cargados por la página.
- No se registraron errores ni advertencias de consola en la sesión revisada. Este resultado sólo describe esa sesión; no valida todos los caminos de juego.
- En la prueba manual de la versión servida previamente se observaron selección de Andrés y VANNESA, persistencia de progreso después de recargar, disparo de VANNESA y activación de resonancia. No se probó el final del capítulo ni se confirmó el ataque de Andrés contra un enemigo en la sesión actual.
- Capturas reales del canvas Phaser se exportaron y verificaron a 960 × 540: QA_CAPTURAS/capitulo-1-andres.png y QA_CAPTURAS/capitulo-1-vannesa.png. Ambas muestran gameplay cargado con el protagonista correspondiente.

## Sustituciones visuales prioritarias

1. Convertir las hojas de referencia actuales en hojas maestras revisadas y completar ciclos frame-by-frame de los estados requeridos, conservando la colisión actual.
2. Completar el tileset modular: bordes/capas laterales de plataformas, pendientes y variaciones de suelo, esquinas, transiciones, interiores, ruinas y decoración con escala nativa consistente.
3. Descomponer la panorámica en capas de profundidad y construir recorrido jugable con hitos, evitando que la misma imagen se perciba como un telón plano detrás de una franja de suelo.
4. Reemplazar slimes/enemigos genéricos por diseños y ciclos animados propios; dar silueta, anticipación y respuesta de impacto a cada enemigo.
5. Rediseñar resonadores y efectos: el resonador actual se ve como un icono ampliado; controlar halos, partículas y brillo para que parezcan parte del mundo.
6. Revisar continuidad del suelo, bases de plataformas y escala de las decoraciones; el arte actual presenta una tira de fondo bajo el camino y hitos aislados grandes.
7. Crear efectos sonoros grabados/diseñados e integrar mezcla musical; actualmente los tonos de acciones son síntesis básica.

## Límites verificados

La validación estructural pasó sintaxis, datos, rutas y ensamblaje con Phaser simulado; no equivale a prueba del motor. En navegador real cargó Phaser 3.80.1/WebGL, el menú, la selección de ambos protagonistas y el capítulo. Se observó movimiento y cámara con Andrés. La consulta de recursos mostró SVG y ambos PNG; la consola quedó sin errores o advertencias en esa sesión. El gameplay del capítulo completo, colisiones exhaustivas, ataque de Andrés contra enemigo, dispositivos móviles y guardado/recarga con la nueva caché siguen pendientes. Las hojas ilustradas mejoran visiblemente al avatar, pero siguen siendo referencias con 12 poses, no un diseño maestro aprobado; escenarios, enemigos y efectos aún no alcanzan producción. No marcar capítulo como terminado.

8. Diseñar y animar enemigos del Valle con arte propio; los sprites actuales siguen siendo genéricos/procedurales.

## Nota de producción de personajes — revisión de brief 2

El mapa de animaciones se audita en [PERSONAJES_MAESTROS_AURALIA.md](PERSONAJES_MAESTROS_AURALIA.md). VANNESA usa cuadros 8 y 9 para especial/proyectil y conserva su proyectil de gameplay; Andrés usa 8 y 9 en ataque cercano. Idle/walk/run actuales son ciclos limitados de 2/2/4 cuadros; los demás estados de atlas son poses fijas. Los objetivos de 8/8/8 locomoción, estados aéreos/daño/resonancia/victoria y ataque 6–8 siguen pendientes.

Observación cuadro por cuadro de los contactos: Andrés 0–1 casi duplicados; VANNESA 0–1 sí muestran parpadeo; ambos ataques/efectos del cuadro 9 alcanzan el borde y contaminan el 10. Los retratos fuente no se alteraron. Estos hallazgos cambian la clasificación de ambos PNG a referencias integradas/prototipo recortado, sin aprobación de producción.

## Estado real de aceptación del capítulo — actualización visual 24-11-2026

Prueba HTTP y WebGL confirmadas en servidor local aislado (8775), sin publicación. Phaser reportó atlas SVG de 24 cuadros, los dos atlas de personaje y música de capítulo en su caché. El contacto de hoja y las capturas gameplay están referenciados en el documento maestro de personajes. Se verificaron manualmente en navegador movimiento, carrera, ataque cercano, salto/aterrizaje de Andrés, y ataque a distancia/resonancia de VANNESA; estas observaciones son muestras puntuales, no una partida completa ni prueba de móvil físico.

La inspección visual a 960 × 540 identifica problemas que bloquean la aprobación: el fondo panorámico domina, los avatares pierden escala/presencia, el suelo y algunas plataformas se leen como rectángulos, el resonador/hitos se ven sobredimensionados frente a la escala modular y hay poca variación local del terreno. La narrativa superpuesta ocupa una franja amplia durante el gameplay. Priorizar composición del plano de juego, dibujo artesanal de personajes/tilesets, corrección de siluetas/escala y revisión de mensajes de apertura. No reemplazar el gameplay por un fondo panorámico.

**Producción de sprites originales no completada:** el entorno no expone la herramienta de generación de imagen integrada requerida por el flujo imagegen y el uso del CLI/modelo API no fue autorizado específicamente. No se creó arte geométrico de reemplazo ni se presentaron las hojas recortadas como arte final. Las referencias locales se conservan intactas.

## A/B de cámara registrado — 24-11-2026

Capturas reales 960×540: `composicion-valle-zoom-100.png` y `composicion-valle-zoom-115.png`. En 1.00× el HUD mantiene márgenes, el mundo permite anticipar plataformas y el héroe conserva su cuerpo visible. En 1.15× el héroe crece 15%, pero el HUD con scrollFactor cero se desplaza/recorta al escalar y el encuadre pierde área útil; por tanto se selecciona 1.00× para este build. La cámara no resuelve la dominancia de la panorámica: el asset comparte montañas, aldea y elementos cercanos en una sola capa con `scrollFactor=.12`, que apenas se mueve. Requiere arte fuente en capas y composición específica, no ornamento aleatorio.

## Verificación reproducida y ajuste de marcador — 24-11-2026

La prueba real de esta revisión obtuvo en Phaser los cuadros secuenciales con `index:1, textureFrame:8` y `index:2, textureFrame:9`. Esto falsó el marcador anterior en índice 1; se cambió `ACTION_TIMELINES` de ambos personajes a índice 2 y se comprobó el resultado: Andrés `phase=complete`, `impactApplied=true`; VANNESA igual, `projectileCreated=true`, `projectileLaunchCount=1`. El comentario del script registra esa semántica observada, sin generalizarla a versiones no probadas.

Movimiento verificado: D, carrera con Shift+D y salto de VANNESA en muestreo corto. Guardado: `kol_save_v2` nivel 0/rol VANNESA continuó presente tras recarga de página. Cargas de assets verificadas en el runtime WebGL: atlas SVG con 24 frames, PNG de ambos personajes, pista del capítulo. No se verificó victoria contra enemigos, colisión de todas las superficies, campaña completa ni dispositivo móvil.

Las capturas nuevas guardadas vía Renderer.snapshot son `QA_CAPTURAS/qa-andres-gameplay.png` y `QA_CAPTURAS/qa-vannesa-gameplay.png`, 960 × 540. El panel espera ahora a recursos listos y una animación estable. La prueba responsive no pudo aplicarse: el viewport efectivo permaneció 1265 × 720.

El mensaje `MutationObserver.observe` se registró en la pestaña de juego y también se controló una pestaña SVG estática sin código del sitio, que reportó otro TypeError. Se considera fuente de observación/automatización probable, pendiente de aislar; se conserva el hecho observado y no se certifica consola sin errores.

## QA de entrada y capturas

El panel local desactiva botones durante la descarga y espera una animación válida más dos cuadros de render antes de exportar. Las últimas capturas en `QA_CAPTURAS/qa-andres-gameplay.png` y `QA_CAPTURAS/qa-vannesa-gameplay.png` muestran la etiqueta de nivel breve; así no se superpone el párrafo largo al plano del juego. Esto resuelve un problema puntual de lectura, no los bloqueadores de escala, fondo o arte modular.

## Aceptación funcional del nivel 1 — 24-11-2026

Estado FAIL / abierto. En navegador real ambos protagonistas aparecieron sobre el suelo con sus hojas cargadas y cuerpo 25,2×46,8. VANNESA saltó con velocidad vertical negativa. Andrés perdió todas las vidas por contacto con slime antes del primer checkpoint; `lastDamage.source=enemy-contact`, posición x≈528, checkpoint=100, seguido de GameOver. Repetir con entradas temporizadas para determinar si el balance es reproduciblemente defectuoso; no se cambió daño sin una prueba controlada.

Se corrigió spawn de slimes de `FLOOR-23` a `FLOOR-44`; Phaser mostró los cuatro cuerpos apoyados (`bottomBlocked=true`). El capítulo es nivel índice 0/stage 0, longitud 3000, ocho plataformas estáticas, una móvil, cuatro slimes, resonador, dos checkpoints y portal, sin jefe. El portal debe guardar nivel 1 y abrir Intermission. Ambos recorridos quedaron incompletos.

Las cinco dimensiones efectivas coincidieron con 1920×1080, 1366×768, 960×540, 390×844 y 844×390. Los controles táctiles permanecieron ocultos (`display:none`); emulación táctil y teléfono físico no verificados. En la última consola solo hubo traza informativa Phaser. No hay `MutationObserver` en el código del proyecto; la anomalía histórica también se observó en una página estática, aunque su origen no quedó concluyente.

Captura inicial válida: `QA_CAPTURAS/aceptacion/andres-initial.png`. El archivo `vannesa-initial.png` muestra GameOver pese a que el inspector registró el inicio; se conserva, pero se invalida como evidencia inicial. `andres-combat.png` solo muestra un slime cercano y no demuestra impacto. No hay capturas válidas de combate, resonancia, checkpoint o final. Arte y animación siguen provisionales; capítulo no aceptado. Matriz detallada: `REGISTRO_PRUEBAS_AURALIA.md`.
