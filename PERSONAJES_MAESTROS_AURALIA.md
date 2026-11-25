# Personajes maestros de AURALIA — Andrés y VANNESA

**Estado: especificación de producción y auditoría de referencias; diseños y animaciones todavía no aprobados.** Esta hoja maestra no declara arte nuevo terminado. Fija los hechos observados y las reglas que debe respetar la siguiente producción artesanal.

## Referencias y recursos actuales

Las fuentes locales `assets/characters/andres-animation-reference.webp` y `assets/characters/vannesa-animation-reference.webp` se conservan sin cambios. `andres-gameplay-sheet.png` y `vannesa-gameplay-sheet.png` son derivaciones PNG RGBA de 1024 × 684; cada una contiene una cuadrícula de 4 columnas × 3 filas con celdas de 256 × 228 px. Phaser usa los PNG en la escena de juego; los retratos WebP son recursos separados para selección.

Contactos numerados inspeccionados:

- [Andrés — contacto de cuadros](QA_CAPTURAS/contacto-frames-andres.svg)
- [VANNESA — contacto de cuadros](QA_CAPTURAS/contacto-frames-vannesa.svg)

Las hojas son recortes de poses de referencia, no ilustraciones frame-by-frame dibujadas para gameplay. Todos los 12 cuadros tienen alfa, pero los cuadros 9 y 10 cruzan el límite de celda: el efecto del ataque de Andrés y el orbe de VANNESA llegan al borde derecho y dejan píxeles en el cuadro siguiente. No desplazar, ampliar ni cambiar estos recortes para ocultar el defecto; volver a dibujar/empacar esos cuadros desde las fuentes maestras en la próxima producción.

## Lectura observada del atlas

Índices Phaser en orden por filas, de izquierda a derecha:

| Índice | Andrés | VANNESA | Uso actualmente registrado |
|---:|---|---|---|
| 0 | Reposo frontal | Reposo, ojos abiertos | `idle` |
| 1 | Reposo casi idéntico, cambio sutil | Parpadeo, ojos cerrados | `idle` |
| 2 | Paso de caminata | Pose de desplazamiento | `walk` |
| 3 | Paso alterno | Paso alterno | `walk` |
| 4 | Carrera, zancada | Carrera/salto, zancada | `run` |
| 5 | Carrera, zancada alterna | Carrera, zancada alterna | `run` |
| 6 | Pose ascendente/salto | Pose de salto | `run` y pose `jump` fija |
| 7 | Pose en aire/descenso | Pose en aire/descenso | `run` y pose `fall` fija |
| 8 | Espada preparada | Preparación/onda de magia | ataque; en VANNESA también resonancia |
| 9 | Barrido de espada con efecto | Orbe de proyectil | segundo cuadro de ataque/proyectil |
| 10 | Daño | Daño | pose fija `hurt` |
| 11 | Victoria | Victoria | pose fija `victory` |

El registro binario confirma alfa y 12 celdas; no acredita continuidad anatómica. El análisis visual encuentra idle de Andrés casi duplicado, estados de salto/caída/aterrizaje/resonancia/victoria sin ciclos suficientes y recortes contaminados en ataques. El tamaño de 1024 × 684 describe el atlas, no la calidad o resolución nativa del dibujo.

## Ancla, escala y física

- Textura de gameplay: 256 × 228 px por celda; origen del sprite `(0.5, 0.97)`; escala Phaser `0.30`.
- Rectángulo local Arcade: `84 × 156`, offset local `(84, 65)`; cuerpo efectivo a escala: **25,2 × 46,8 unidades**. Mantenerlo mientras no haya una prueba de colisión que justifique un cambio.
- La física se calcula sobre el cuerpo de Arcade, no sobre alfa, accesorios, espada, cabello ni efectos que sobresalen.
- Al volver a dibujar, conservar la línea de pies y el punto de anclaje. No compensar saltos de pose moviendo el cuerpo físico ni retorciendo/escalando la ilustración.

## Mapeo Phaser vigente y límite de lo terminado

Los identificadores `ref-andres-*` y `ref-vannesa-*` son animaciones de Phaser construidas con los índices existentes. Ahora mismo: idle usa 2 cuadros a 2 fps; walk usa 2 cuadros a 8 fps; run usa 4 cuadros a 11 fps; ataque de Andrés y especial de VANNESA usan 2 cuadros a 12 fps. Las demás entradas (jump, fall, land, resonance, hurt, victory) son una sola pose a 1 fps y **no son ciclos animados**. El impacto/recuperación de ataque no está ilustrado como una secuencia completa.

El movimiento, la habilidad y las transiciones de gameplay ya seleccionan estas entradas, y `lastCharacterAnimation` evita volver a iniciar una animación idéntica en cada actualización. VANNESA conserva el proyectil real de gameplay y el ataque muestra el cuadro 8→9. Andrés aplica el impacto físico de cerca durante su ventana de ataque. Es integración funcional sobre arte provisional; no es criterio de aprobación artística.

## Diseño por aprobar

La referencia local existente manda sobre cualquier detalle inventado. El diseño final debe preservar rasgos reconocibles respaldados por esas referencias; no se deben introducir semejanzas fotográficas no suministradas.

- **Andrés:** conservar identidad facial/cabello, proporción y vestuario que puedan verificarse en la referencia. Darle silueta legible en reposo, zancada y ataque; espada y efecto separados de su volumen corporal.
- **VANNESA:** usar exactamente ese nombre en producto y documentación. Mantener la identidad de rostro, volumen de cabello y vestuario observables; diferenciar su silueta de Andrés y mantener legible su magia a escala nativa.
- Antes de autorizar una hoja maestra: aprobar una vista neutral y una pose de acción por personaje, paleta, proporciones, contorno, manos, rostro, pliegues, línea de suelo y tamaño de lectura real. Registrar aprobación explícita y versión de origen.

## Especificación de producción objetivo

Por personaje, dibujar cuadros únicos y revisar secuencias en tamaño real: idle 8; walk 8; run 8; preparación de salto 3; ascenso 4; caída 3; aterrizaje 3; daño 4; resonancia 8; victoria 6. Andrés necesita ataque físico de 6–8 cuadros con anticipación, impacto y recuperación. VANNESA necesita preparación, lanzamiento y recuperación propios; el instante de creación del proyectil debe coincidir con el cuadro de lanzamiento. Ningún objetivo se considera cubierto por cuadros repetidos, volteos, tintes, escalado o tweens de una sola pose.

Cada atlas de producción debe indicar tamaño de cuadro, origen/pivote, índice/nombre, FPS, repetición y procedencia; mantener márgenes transparentes, píxeles dentro de su celda y pies alineados. Se recomienda separar locomoción, combate y expresiones si reduce errores de corte. Las nuevas hojas deben tener licencia/procedencia registrada y preservar las fuentes anteriores.

## Aprobación

Estado de aceptación: **pendiente**. Faltan diseños maestros aprobados, hojas originales completas, revisión cuadro por cuadro, capturas reales de todos los estados, colisión de bordes/plataformas/enemigos, partida continua y validación móvil. Las capturas actuales de capítulo documentan la integración en pantalla, no la aceptación del arte ni todos los estados.

Ajuste de timing: VANNESA libera el proyectil 82 ms después del inicio del especial, para alinearlo con el ciclo 8→9; Andrés resuelve el impacto cercano tras la misma anticipación, alineado con el cuadro de barrido disponible. Los callbacks abortan si el jugador salió de escena o el capítulo terminó. Esto mejora el momento mecánico respecto a los dibujos existentes; no crea preparación/recuperación dibujadas ni constituye ciclo profesional. Panel QA incluye tiempo restante de ataque y cuenta de proyectiles para observar la ventana.

## Auditoría técnica de las hojas (24-11-2026)

`node tools/audit-character-sheets.cjs` decodifica PNG RGBA8 sin modificar los atlas ni las referencias y produce `QA_CAPTURAS/auditoria-limites-spritesheets.md/.json`. El informe incluye bbox alfa por celda, ocupación/área transparente, conteo alfa en los cuatro bordes, última fila con alfa y variación de máscara entre cuadros adyacentes. Esos conteos de máscara no prueban duplicación anatómica.

Los contactos ahora marcan en rojo las celdas 09 y 10 para mostrar el seam defectuoso. Hay alfa pegado en 87 filas compartidas de Andrés (88 px borde R / 87 px borde L) y 63 filas de VANNESA (71/63 px). El defecto requiere separar y redibujar el efecto; borrar alfa, flood-fill o desplazar píxeles estropearía las fuentes. El script sólo escribe el informe y anotaciones del SVG de contacto.

Línea inferior alfa por cuadro (no equivalente a un esqueleto de pies): Andrés `[223,223,227,222,227,208,217,217,218,218,218,218]`; VANNESA `[212,212,213,212,194,202,202,191,198,196,198,201]`. Los movimientos aéreos/carreras explican variaciones de pose, pero no hay pivote de pie aprobado ni metadatos por cuadro. Revisión del contacto y diseño de origen siguen siendo necesarios para distinguir postura intencional de recorte/desplazamiento.

## Área visible y cámara

Canvas lógica: 960 × 540; camera zoom encontrado: 1.00; escala de textura: `.30`; cuadro: 256 × 228. Los bbox alfa iniciales (144 × 218 Andrés; 129 × 201 VANNESA) producen aproximadamente 43 × 65 y 39 × 60 unidades de pantalla, antes de escalar la página por FIT. El sprite completo mide 76.8 × 68.4 unidades; queda mucha transparencia lateral en VANNESA y hay pivote/origen del pie no validado. La posición de suelo observada del jugador es alrededor de y=461/540 (85.4% de altura); los muestreos del salto previo llegaron aproximadamente 125 unidades por encima del suelo, cerca del 23% de la altura lógica.

Comparación real de inicio, misma escala y resolución, en `QA_CAPTURAS/composicion-valle-zoom-100.png` y `...zoom-115.png`. Zoom 1.15 hace al héroe ~15% mayor, pero agranda HUD y terreno y desplaza etiquetas fijas hasta cortar el HUD; se conserva 1.00 como base. El problema de presencia no se debe solucionar ampliando el fondo, sino con personaje de producción, alfa/canvas mejor aprovechados y fondos verdaderamente separados en capas. El fondo actual es un tileSprite panorámico con scrollFactor `.12`, o sea, casi inmóvil al caminar.

## Canal de acciones y marcador de evento

Se sustituyeron los 82 ms por un `ACTION_TIMELINES` central asociado a cada rol en `src/auralia-remaster.js`. Andrés usa pose `attack`; VANNESA usa `special`. Ambos comparten, por ahora, el segundo cuadro del ciclo (`AnimationFrame.index=1`, textura 9) como marcador de contacto/lanzamiento. `animationupdate` dispara el efecto mecánico al cambiar realmente al cuadro indicado; `animationcomplete` inicia `recoveryMs=110`, y el update del nivel finaliza recuperación y vuelve a reposo. Daño/fin pueden interrumpir; resonancia no pisa una acción en curso; al cambiar escena el estado se limpia. En el arte actual sólo existen anticipación y un cuadro de impacto: la recuperación es una espera sobre la última pose, no un dibujo de recuperación. El camino heredado sin atlas todavía aplica el efecto de forma inmediata y está señalado como provisional.

El inspector QA conserva `lastAction`, índice/textura que activó el marcador, resultado del impacto, fase final y contador de proyectiles para poder verificar eventos cortos aunque la consulta llegue después de la animación. Phaser emite `animationupdate` cuando avanza el cuadro; la API define `AnimationFrame.index` como índice dentro de la secuencia ([Phaser Animation Events](https://docs.phaser.io/api-documentation/namespace/animations-events), [Phaser AnimationFrame](https://docs.phaser.io/api-documentation/class/animations-animationframe)).
