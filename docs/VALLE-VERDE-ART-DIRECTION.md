# VALLE VERDE — Dirección artística

## 1. Objetivo

Definir un lenguaje visual único: pixel art HD cinematográfico, romance elegante, nostalgia urbana de 1995–2000 y Medellín contemporánea. El resultado debe parecer una producción independiente cuidada, no una plantilla ni una colección de imágenes inconexas.

## 2. Paleta base

| Rol | Color | Uso |
|---|---|---|
| Negro azulado | `#101525` | fondos nocturnos, contornos, interfaz |
| Azul real | `#203E70` | identidad principal, VANNESA, acentos |
| Oro suave | `#D6B46A` | detalles, luces, hitos, ANDRÉS |
| Marfil | `#F1EBDD` | textos claros, luces cálidas |

Complementos: verdes tropicales, concreto cálido, ámbar, azul nocturno y tonos naturales de vegetación. No utilizar rojo intenso como color dominante ni convertir todos los escenarios en neón.

## 3. Estilo y renderizado

- Pixel art HD con clusters limpios, siluetas legibles y texturas controladas.
- Volumen, sombras coherentes, perspectiva consistente y contraste legible.
- Cámara lateral 2D con profundidad por capas y parallax.
- Base lógica de referencia 960×540, respetando la configuración real del proyecto.
- Pixel edges nítidos; evitar escalado borroso, líneas de píxel inconsistentes o interpolación accidental.
- Iluminación ambiental por región y efectos moderados para preservar legibilidad y rendimiento.

## 4. Composición por capas

1. Cielo y atmósfera: nubes, lluvia, neblina y gradiente horario.
2. Montañas: silueta del Valle de Aburrá, capas de profundidad y cambios de luz.
3. Ciudad intermedia: barrios, edificios, estaciones, viaductos y puentes.
4. Arquitectura cercana: fachadas, comercios, postes, balcones, ventanas y señalización.
5. Plano jugable: suelo, plataformas, obstáculos, puertas, elementos interactivos y foreground.

Cada capa tiene un factor de scroll diferente. Evitar duplicación accidental de fondos y decoración repetida en patrón evidente.

## 5. Clima e iluminación

- Centro: mañana cálida, concreto, sombras urbanas y reflejos.
- Laderas: luz natural de montaña, murales y luces de vivienda.
- Río: reflejos de agua, puentes y cielo de atardecer.
- Norte: luz filtrada por vegetación, verde profundo y azul.
- Cerro: transición de oro al azul nocturno y ciudad iluminada.

Efectos posibles: lluvia, pavimento mojado, bruma de montaña, hojas, polvo, luces de ventanas, agua, partículas de resonancia y brillos. Los efectos tienen que tener límites y respetar opciones de reducción de movimiento/efectos.

## 6. Diseño de personajes

Las referencias fotográficas solo sirven para definir rasgos; no se copian ni se publican en el repo. Los recursos finales son ilustraciones originales estilizadas.

### ANDRÉS

Cabello oscuro corto rizado, cejas gruesas, ojos oscuros, barba y bigote recortados, proporciones naturales. Esmoquin negro, solapas satinadas, camisa blanca, corbatín negro, pantalón negro, zapatos formales y pequeño pin dorado. Silueta distinguible incluso a tamaño pequeño.

### VANNESA

Cabello largo liso oscuro/castaño, raya central, ojos grandes oscuros y facciones delicadas. Vestido largo azul noche y negro, bordados dorados finos, falda con movimiento, piedras azules y tiara delicada. La falda no puede tapar la lectura de piernas/hitbox durante el gameplay.

### Continuidad

Diseño frontal, lateral, espalda y expresiones aprobados antes de producir hoja completa. Spritesheet con celdas uniformes, transparencia verificada, pivote estable, margen de seguridad y nombres de frame documentados. No generar una imagen con varias poses y asumir que ya es un spritesheet funcional.

## 7. Escenarios de Medellín

### Mundo I — Centro

Parque/Barrio central, fachadas tradicionales, estación, viaducto de Metro y montañas de fondo. La señalización puede ser ficticia, salvo que se represente una estación real documentada.

### Mundo II — Laderas

Viviendas escalonadas, murales, callejones, escaleras eléctricas, balcones, jardineras y cabinas del Metrocable. Diferenciar claramente escaleras eléctricas y cable aéreo.

### Mundo III — Río

Corredor del río, puentes, zonas verdes, pasos peatonales, infraestructura y trenes. El agua y sus reflejos participan en acertijos.

### Mundo IV — Norte

Vegetación tropical, Orquideorama, jardines, espacios inspirados en Parque Explora y Planetario; estructuras geométricas, luz y acertijos.

### Mundo V — Cerro

Senderos, miradores, arquitectura inspirada en Pueblito Paisa, panorama del Valle de Aburrá y transición atardecer/noche.

## 8. Transporte

- Metro: trenes blancos/verdes, ventanas, faros, puertas, plataforma, señalización, sonido y movimientos coherentes.
- Metrocable: cabinas, torres, cables, terminales y vistas de montaña.
- Tranvía: vía urbana, estaciones, curvas y señalización.
- No inventar estaciones/conexiones reales ni mostrar como actual una infraestructura futura.
- Las secuencias jugables pueden ser ficticias, pero deben identificarse como parte de la fantasía de VALLE VERDE.

## 9. Elementos ambientales

Ventanas iluminadas, vehículos, bicicletas, personas en segundo plano, comercios, jardines, árboles, anuncios ficticios, postes, puentes y señalización. Los NPC de fondo no se convierten en enemigos ni se usan estereotipos de habitantes reales.

## 10. UI y marca

- Marca visible: VALLE VERDE.
- Lema secundario opcional: LA CANCIÓN DE DOS LUCES.
- ANDRÉS & VANNESA como protagonistas.
- Interfaz elegante, compacta, legible y adaptable.
- Tipografía de buena lectura, jerarquía visual, estados de botones y feedback.
- No incluir ChatGPT, OpenAI, generadores, herramientas, marcas de agua ni créditos no autorizados.
