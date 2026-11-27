# VALLE VERDE — Especificación de jugabilidad

## 1. Estado de partida y ciclo principal

Selección de ANDRÉS/VANNESA → introducción de capítulo → exploración y plataformas → habilidad/resonancia/rompecabezas → coleccionables y checkpoints → guardián en el capítulo 3 de cada mundo → recompensa/nota → intermedio y siguiente capítulo.

El jugador debe comprender en todo momento el objetivo inmediato, la ruta principal y los mecanismos que requieren interacción. Objetivos opcionales se distinguen de los obligatorios.

## 2. Controles

| Acción | Escritorio |
|---|---|
| Izquierda | A / flecha izquierda |
| Derecha | D / flecha derecha |
| Saltar | Espacio / W / flecha arriba |
| Correr | Shift |
| Habilidad | F / X |
| Resonancia | E |
| Pausa | Escape |

Móvil: botones grandes y separados de izquierda, derecha, correr, habilidad, resonancia y salto; adaptables a horizontal/vertical; no tapar HUD u objetivos; gestionar pointerdown/up/cancel/lost capture y pérdida de foco.

## 3. Movimiento y física

Mantener o implementar aceleración, desaceleración, velocidad máxima, salto variable, gravedad, caída, aterrizaje, retroceso, colisiones e interacción. Las hitboxes son independientes de los sprites y deben poder visualizarse en modo debug.

ANDRÉS conserva salto estándar. VANNESA tiene doble salto. Las rutas obligatorias de los quince capítulos deben ser completables con ambos. No se puede exigir una capacidad exclusiva de VANNESA a ANDRÉS.

Comprobar distancias horizontales y verticales, velocidad, duración de salto, gravedad, plataforma de destino, margen de aterrizaje, moving platforms, cámara y límites del mundo. La geometría de una falda o accesorio visual no debe alterar la hitbox de forma accidental.

## 4. Habilidades

### Pulso Dorado — ANDRÉS

Descarga de energía alrededor de manos y antebrazos. Debe incluir inicio/anticipación, emisión, impacto, enfriamiento y feedback. Usos: mecanismos, neutralización de determinados enemigos, protección diseñada y acertijos.

### Resonancia Azul — VANNESA

Carga y proyectil/onda luminosa. Debe tener preparación, lanzamiento, trayectoria, impacto, feedback y enfriamiento. Interactúa a distancia, activa mecanismos y revela objetos.

Las habilidades deben ofrecer diferencias significativas sin hacer imposible el juego con ninguno de los personajes.

## 5. Resonancia compartida

Un resonador activado puede revelar camino, generar puente, aturdir enemigos, mostrar pistas, abrir secretos o interactuar con jefe según reglas explícitas. Conservar si técnicamente posible el eco/proyección del otro protagonista: representa que ambos forman parte de la aventura, aunque se controle a uno.

## 6. Combate

Combate ligero, romántico y no bélico. No usar habitantes reales ni estereotipos como enemigos.

Tipos propuestos:

- Eco de concreto: patrulla/bloqueo.
- Luciérnaga errante: vuelo y desplazamiento vertical.
- Reflejo de lluvia: movimiento rápido de suelo.
- Sombra del cable: persecución.
- Centinela de estación: protege mecanismo o área.

Cada enemigo requiere arte, animación, movimiento, patrón, señal previa, hitbox, resistencia, reacción al daño y derrota.

Reglas: invulnerabilidad gestionada en una ventana coherente; no daño repetido durante el mismo contacto; retroceso en dirección opuesta al enemigo; comprobar ataque desde arriba con datos de cuerpo/velocidad y solapamiento vertical, no comparar solo origen de sprites; animación/sonido de hit; logs reproducibles.

## 7. Guardianes

Cinco guardianes únicos, uno al final de cada mundo. Cada uno necesita intro, nombre, barra de vida, arena, patrones propios, fases, avisos de ataque, vulnerabilidad, animación, reacción, derrota, recompensa y transición. No reutilizar un único jefe cambiándole el color.

1. Guardián del campanario: metal, luz y engranajes; enseña patrón y vulnerabilidad. Recompensa ORIGEN.
2. Reina de las luciérnagas: ilusiones y fuentes de luz falsas/verdaderas. Recompensa ENCUENTRO.
3. Leviatán de cristal: entidad acuática/reflejos y puntos vulnerables. Recompensa MEMORIA.
4. Vigía de la aurora: defensa, exposición del núcleo y resonancia final. Recompensa ESPERANZA.
5. Afinador del Silencio: usa las habilidades y mecánicas aprendidas; derrota emocional y reflexiva. Recompensa UNIÓN.

## 8. Objetos y progresión

| Elemento | Uso |
|---|---|
| Fichas de luz | Puntos/recompensas |
| Corazones | Recuperación/progreso, según balance validado |
| Estrella protectora | Protección temporal |
| Recuerdo secreto | Narrativa opcional |
| Resonador | Descubrimiento/progresión |
| Checkpoint | Guardar posición |
| Nota musical | Progresión principal |

No inventar recuerdos reales de la pareja. Los secretos opcionales no deben bloquear el final.

## 9. Guardado

Persistir capítulo, personaje, vidas, puntuación, coleccionables, checkpoints, capítulos completados y opciones. Probar recarga, reinicio del navegador y migraciones. No destruir datos existentes al cambiar esquema. Versionar Service Worker y caché PWA para que el navegador no reutilice recursos viejos.

## 10. Reglas de UX

- Feedback visual/sonoro para cada acción importante.
- Tutorial contextual breve en capítulo 1.
- Pausa real y reanudación estable.
- Indicador de objetivo y pista cuando un mecanismo es obligatorio.
- Menú accesible y opciones de música/efectos/volumen/calidad/controles/pantalla/efectos reducidos.
- HUD compacto: protagonista, mundo, capítulo, vidas, puntuación, fichas, corazones, notas, progreso, jefe y pausa.

## 11. Defectos heredados que deben reproducirse antes de corregir

Los informes existentes registran que ANDRÉS perdió sus vidas por contacto enemigo antes de llegar al primer checkpoint (aprox. x<550 en una sesión) y que VANNESA saltó pero no se confirmó un aterrizaje en la primera plataforma. Estos fallos no están corregidos por la creación de esta especificación.

No asumir causas sin medición. Instrumentar posición, velocidad, grounded, body bounds, tipo de colisión, vidas, fuente del daño, tiempo de invulnerabilidad y estado de checkpoint. Corregir en unidades pequeñas y añadir pruebas de regresión.
