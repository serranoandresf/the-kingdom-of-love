# Dirección artística — AURALIA

## Intención

THE KINGDOM OF LOVE presenta una fantasía romántica íntima, pictórica y aventurera. Su identidad combina pixel art de alto detalle en escenarios con personajes legibles, expresivos y claramente separados del fondo. El tono es cálido y elegante; no infantil ni genérico.

La historia y el diseño visual sostienen la premisa: Andrés y VANNESA se eligen mientras el mundo recupera su armonía. La resonancia revela vínculos y caminos, y se lee como ondas de luz que reaccionan a materiales y distancias del lugar.

## Base observada

- El viewport lógico es 960 × 540. Las escenas conservan pixel art y escalan con Phaser.
- El Valle usa una ilustración panorámica existente como referencia de color y atmósfera; la capa lejana se desplaza más despacio que el jugador.
- Los protagonistas de gameplay ahora usan hojas locales con 12 poses ilustradas ya incluidas en el proyecto. La hoja no es todavía un diseño maestro revisado por artista.
- El atlas modular del Valle tiene celdas de 48 × 48. Hay que inspeccionar cada celda a tamaño nativo y la escena a escala de juego antes de aprobar el acabado.
- La paleta de cada mundo se define en src/data.js. No introducir variaciones que rompan esa identidad.

## Reglas de producción

### Personajes

- Mantener silueta humana y expresiva, lectura frontal/3⁄4 y el contraste azul real con oro compartido por ambos.
- Andrés conserva capa carmesí, ropa azul, cuero y espada; VANNESA conserva corona, cabello oscuro largo y vestido/capa azul con oro y magia violeta.
- Mantener el nombre VANNESA exactamente.
- El contraste de contorno debe separar cabello y capa del escenario sin añadir resplandores permanentes.
- Conservar hitbox de gameplay mientras el dibujo evoluciona: 25,2 × 46,8 unidades efectivas en la rama actual.
- No alterar expresiones, proporciones, vestuario ni dirección de luz entre cuadros de un mismo ciclo.

### Mundo y composición

- Mantener el plano de suelo despejado y de contraste suficiente; raíces, hierba y efectos no pueden ocultar pies, plataformas, amenazas ni salidas.
- Organizar cada tramo con capas distantes, medias y cercanas. Las capas lejanas tienen menos contraste y velocidad de cámara.
- Variar la silueta de árboles, rocas y ruinas por sector. No clonar grupos visuales con la misma distancia o escala.
- Los bordes jugables deben corresponder a la colisión. Decoración sin colisión se mantiene fuera de la zona de contacto.
- La panorámica sirve como guía de paleta y horizonte; el gameplay requiere capas y piezas separadas que cambien con cámara y resonancia.
- La luz de la resonancia debe tener fuente, color y alcance asociados a una campana, puente o secreto. Limitar halos y partículas para no competir con el jugador.

### Regiones

Las paletas base corresponden a los valores de src/data.js y se resumen visualmente así:

| Región | Cielo y distancia | Plano cercano | Acento |
|---|---|---|---|
| Valle de las Campanas | Cielo azul claro, montañas verde azulado | Prado y piedra cálidos | Oro de campana |
| Bosque de las Luciérnagas | Verde pizarra y sombra de bosque | Raíces y follaje profundo | Oro de luciérnaga |
| Mar de Vidrio | Turquesa y azul marino | Coral y cristal | Cian luminoso |
| Cumbres del Invierno Azul | Azul lavanda y nieve | Piedra fría | Cian de aurora |
| Ciudad del Eclipse | Índigo profundo y violeta | Piedra oscura | Oro de eclipse |

Los valores HEX canónicos permanecen en el código de datos. Esta tabla es una regla de dirección, no una fuente de color alternativa.

## Escala y nitidez

- Canvas lógico: 960 × 540.
- Tile base del Valle: 48 × 48 píxeles fuente.
- Hoja de gameplay actual: 1024 × 684, 4 columnas × 3 filas, cuadros 256 × 228. Display actual: escala 0,30, origen (0,5; 0,97).
- Renderizar arte de personaje sin filtro de suavizado adicional. Revisar a 100% de la escena y en el tamaño efectivo de pantalla de escritorio/móvil.
- Evitar estirar una celda pequeña para convertirla en arquitectura principal; separar detalle de silueta.

## Estado de aprobación

Esta dirección es la línea base. Las hojas actuales son una mejora visible tomada de recursos locales y no una aprobación final de arte. El fondo, el terreno, las plataformas, los enemigos y las animaciones necesitan consistencia demostrada en el recorrido completo antes de designar el capítulo como producción.

## Estado de producción de protagonistas — 24-11-2026

La especificación verificable está en [PERSONAJES_MAESTROS_AURALIA.md](PERSONAJES_MAESTROS_AURALIA.md). Las hojas de juego actuales son recortes de referencias locales de 12 poses, no arte maestro aprobado. Los cuadros 9/10 presentan derrame de alfa entre celdas y varios estados son poses estáticas. No presentarlos como animación completa ni usar cambios de escala/rotación para encubrir cuadros faltantes. Toda producción nueva debe mantener el ancla y el cuerpo de Arcade de 25,2 × 46,8 unidades hasta comprobar una razón para cambiarlo.
