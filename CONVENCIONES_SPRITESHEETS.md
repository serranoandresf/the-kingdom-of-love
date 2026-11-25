# Convenciones de spritesheets — AURALIA

## Convención general

- Entregar PNG RGBA con transparencia real.
- El juego usa cuadros en orden de lectura: izquierda a derecha y de arriba abajo.
- Las celdas de una hoja deben tener dimensiones iguales, pivote consistente y espacio suficiente para que capa, cabello, corona, espada y magia no se corten.
- No hornear sombras de escenario ni fondos en el cuadro del personaje.
- Mantener el tamaño de colisión en coordenadas de mundo independiente del tamaño de la hoja.
- Nombrar recursos con personaje y uso: andres-gameplay-sheet.png, vannesa-gameplay-sheet.png.
- Nombrar animaciones ref-andres-idle, ref-andres-walk, ref-andres-run, ref-vannesa-idle y equivalentes.
- En iteraciones nuevas, usar nombres versionados o rama de sustitución hasta aprobar el recurso.

## Hojas actualmente integradas

| Campo | Andrés | VANNESA |
|---|---|---|
| Archivo en juego | assets/characters/andres-gameplay-sheet.png | assets/characters/vannesa-gameplay-sheet.png |
| Origen | andres-animation-reference.webp local | vannesa-animation-reference.webp local |
| Formato | PNG RGBA | PNG RGBA, fondo exterior opaco separado por conectividad |
| Tamaño | 1024 × 684 px | 1024 × 684 px |
| Cuadrícula | 4 columnas × 3 filas | 4 columnas × 3 filas |
| Cuadro | 256 × 228 px | 256 × 228 px |
| FPS | Idle 2; caminar 8; correr 11; ataque 12 | Idle 2; caminar 8; correr 11 |
| Gameplay | Escala 0,30; origen x 0,5, y 0,97 | Escala 0,30; origen x 0,5, y 0,97 |
| Colisión efectiva | 25,2 × 46,8 unidades | 25,2 × 46,8 unidades |

Los FPS se expresan como velocidad de reproducción de Phaser. Ataques, salto, caída, daño, resonancia y victoria todavía usan una sola imagen por estado salvo el ataque de Andrés.

## Mapa de cuadros

| Índice | Andrés | VANNESA |
|---:|---|---|
| 0 | Reposo | Reposo |
| 1 | Parpadeo/gesto | Parpadeo/gesto |
| 2–3 | Paso de caminar | Paso de caminar |
| 4–7 | Ciclo de carrera y zancadas aéreas | Ciclo de carrera y zancadas aéreas |
| 8 | Preparación/ataque con espada | Resonancia con halo |
| 9 | Corte/ataque | Conjuro/proyectil |
| 10 | Daño | Daño |
| 11 | Victoria | Victoria |

Índices de pose y aspecto son los del material de referencia actual. Los cuadros no tienen nombres o anotaciones del artista original; verificar qué gesto representa cada uno antes de crear una hoja maestra.

## Herramienta de recorte

tools/prepare-character-sheets.html recorta las referencias instaladas en una cuadrícula 4 × 3. tools/export-character-sheets.cjs guarda sólo los dos PNG de gameplay esperados y sirve localmente la página. El recortador conserva las poses; para VANNESA vuelve transparente la zona de fondo oscura conectada a los bordes y no elimina zonas oscuras encerradas por el dibujo.

Antes de reemplazar una hoja: revisar transparencia, cuatro bordes de cada cuadro, registro de pies/origen, parpadeo de animación, lectura a escala nativa, hitbox y carga en navegador.

## Convención aplicada a los protagonistas (auditoría 24-11-2026)

Los atlas actuales son cuadrículas 4 × 3 de 256 × 228 px/celda, RGBA 1024 × 684. Los índices Phaser se leen por filas; el mapa observado, ancla `(0.5, 0.97)`, escala `.30`, cuerpo local `84 × 156` y offset `(84,65)` se especifican en [PERSONAJES_MAESTROS_AURALIA.md](PERSONAJES_MAESTROS_AURALIA.md). Las imágenes fuente no se sobrescriben.

El marco de celda debe contener todo el alfa. La inspección encontró que los cuadros 9 de ambos personajes derraman píxeles a los cuadros 10; resolverlo al reempacar/dibujar, sin alterar la referencia fuente ni ocultar el problema recortando visualmente. Una animación de 1 pose es pose fija, no ciclo. Dos poses son un ciclo limitado y no satisfacen los objetivos de producción de 8 cuadros.

## Organización recomendada para arte definitivo

No crear estos archivos hasta que exista arte de origen aprobado. Para separar autoría y recursos de runtime:

- `assets/characters/source/approved/` — turnarounds, paletas y diseños maestros originales sin editar.
- `assets/characters/production/andres/andres-locomotion.png` + `.json`; `andres-actions.png` + `.json`.
- `assets/characters/production/vannesa/vannesa-locomotion.png` + `.json`; `vannesa-actions.png` + `.json`.
- `assets/worlds/valle/sky-clouds`, `far-mountains`, `mid-village`, `near-vegetation`, `foreground-ground` — imágenes/tile layers independientes, nunca una panorámica que contenga todo el gameplay.
- `assets/worlds/valle/tileset-ground.png` + atlas JSON — suelo modular top/edge/inner/corner/transition/cliff/slope/platform support y variaciones aprobadas.
- `assets/enemies/valle/{slime,moth,guardian}/` — diseño, atlas, pivote, hitbox, telegraph, hit/recoil y defeat.
- `assets/vfx/resonance/` y `assets/audio/foley/` — anillos/ondas exportados, impactos, disparos y pasos originales; mantener las cinco pistas musicales actuales.

## Especificación técnica de exportación objetivo

- PNG RGBA8 con alfa auténtico; atlas JSON separado; sin matte, color key ni píxeles de frame vecino. Ninguna fuente maestra se aplana/sobrescribe.
- Tamaño recomendado de celda de personaje: 288 × 320 px como punto de partida para pruebas; silueta visible deseada cerca de 200 × 270, sin deformar; Canvas lógico 960 × 540 y escala visual inicial `.30`. Revisar lectura nativa antes de aceptar.
- Grid por estado o atlas TexturePacker: locomoción 37 cuadros en 8 columnas (8 idle, 8 walk, 8 run, 3 preparación, 4 ascenso, 3 caída, 3 aterrizaje); acciones 20–24 cuadros según ataque (Andrés 6–8, daño4, resonancia8, victoria6; VANNESA ataque de distancia con preparación/lanzamiento/recuperación). Índices y nombres declarados en JSON, no inferidos por orden visual.
- Cada cuadro usa pivote común en línea de suelo; origen Phaser propuesto `(0.5, 0.97)`. Con celda 288×320 y la hitbox actual en escala `.30`, body local objetivo sería 84×156 con offset aprox. `(102,154)`, que produce la misma caja efectiva 25.2×46.8 y alinea su base con el pivote. Verificar manualmente al integrar.
- Metadata: animación, índices de entrada/salida, fps, repeat, transición/interruptibilidad, marcador `impact` o `launch`, comienzo de recuperación, altura de suelo y procedencia/licencia.
- Validación: dimensiones uniformes/JSON; alfa no nulo; margen sin recortes; comparación de borde entre celdas; baseline/pivote; cuadro único y revisión de duplicados; conteo de cuadros; markers existentes; captura de silueta a escala 1×; integración con hitbox heredada.
