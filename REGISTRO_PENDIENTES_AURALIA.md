# Pendientes de producción — AURALIA

## Bloqueadores de aceptación del Valle (24-11-2026)

- Repetir recorrido con entradas temporizadas: Andrés perdió las vidas por `enemy-contact` antes del primer checkpoint; distinguir interacción esperada de defecto reproducible.
- Confirmar salto/aterrizaje de Andrés y aterrizajes sobre las ocho plataformas estáticas y la móvil; comprobar bordes y colisiones laterales.
- Probar ataque cercano y proyectil de VANNESA contra HP real de slime; verificar daño, recuperación e invulnerabilidad.
- Verificar resonador x=900 y puente, checkpoints x=1200/2180, caída/respawn, recarga y conservación de `kol_save_v2`.
- Completar nivel índice 0 con cada protagonista hasta portal x=2915; demostrar guardado nivel 1 e intermisión.
- Investigar por qué `#touch-controls` queda oculto (`display:none`) en viewports probados; hacer emulación táctil y después prueba física.
- Aislar origen de `MutationObserver.observe`: no existe referencia en archivos del juego y no apareció en última consola, pero su fuente histórica no es concluyente.
- Capturar combate, resonancia, checkpoint y final solo cuando se consigan en partida real. Hoy solo existen capturas iniciales de ambos.
- Repetir encuentros tras corregir spawn no volador a `FLOOR-44`; su apoyo actual sí fue observado en Phaser.

Prioridad de capítulo 1 antes de iniciar otros mundos:

1. Revisión artística de las hojas actuales y producción de spritesheets maestras originales para Andrés y VANNESA, con caminata/carrera/ataque y estados principales realmente animados.
2. Probar hitbox original de ambos avatares a lo largo de suelo, plataformas estáticas/móviles, bordes y enemigos. Mantener 25,2 × 46,8 unidades hasta balance basado en evidencia.
3. Hacer una partida continua del capítulo: salto, aterrizaje, enemigos, ataque, resonancia, puente, checkpoints, salida, guardado y recarga.
4. Diseñar animaciones propias para los slimes del Valle, sus telegráficos, impacto, derrota y respuesta al ataque.
5. Redibujar/expandir las celdas del tileset del Valle a resolución y materiales consistentes; eliminar ampliaciones de íconos como hitos principales.
6. Separar la panorámica en capas con profundidad comprobable y crear sectores transitables que tengan landmarks, transiciones y secretos relacionados con resonancia.
7. Mejorar las bases visuales de plataformas y la continuidad del terreno. Comprobar su correspondencia con Arcade Physics.
8. Diseñar efectos ambientales y de resonancia con presupuesto medido de partículas/alpha y sin tapar colisiones.
9. Reemplazar tonos de acción por efectos sonoros diseñados; verificar mezcla, pausa, silencio, desbloqueo y transiciones musicales.
10. Probar entrada táctil y layout en viewport de teléfono vertical y horizontal, además de escritorio.
11. Exportar capturas PNG reales a una carpeta de QA del proyecto y vincular cada una a la prueba que documenta.
12. Repetir la validación del Service Worker al cambiar spritesheets y assets para revisar la actualización de caché y uso offline.

No se debe marcar capítulo 1 como aceptado hasta que las pruebas críticas de gameplay, colisión, arte, audio, responsive y final de nivel tengan evidencia real.

## Lista de aceptación de protagonistas — actualizada 24-11-2026

Prioridad inmediata: aprobar los diseños maestros con la referencia existente y producir hojas originales frame-by-frame completas. Corregir contaminación de celdas 9/10. Añadir los ciclos objetivo y las secuencias de combate especificadas en [PERSONAJES_MAESTROS_AURALIA.md](PERSONAJES_MAESTROS_AURALIA.md). Probar todas las transiciones y secuencias en navegador real, exportando capturas por estado y secuencia. Verificar daño real, aterrizaje, resonancia, impacto del proyectil, ataque cercano, final y persistencia. Ejecutar recorrido completo con cada protagonista; después probar escritorio y viewport móvil.

La versión instalada actualmente ofrece ciclos limitados de dos/cuatro cuadros y varias poses fijas. Esto es integración jugable parcial, no personajes finalizados. No avanzar a otros mundos ni aceptar el capítulo uno hasta cerrar esos puntos con evidencia.

## Capturas de personaje por estado

Las nuevas capturas separadas dentro de `QA_CAPTURAS/personajes/` muestran los cuadros reales de reposo registrados por Phaser junto con el gameplay del Valle. No son ilustraciones aisladas ni prueban la secuencia entera. La captura automatizada de estados breves de ataque/aterrizaje puede perder la ventana antes de que el botón del panel complete la acción; por eso no se etiquetan como capturadas hasta confirmar el `animation` en el inspector. Pendiente extender el arnés para disparar y guardar un estado en una sola acción síncrona segura, y reunir secuencias de los 20 conjuntos de estados.

La cámara se probó en 1.00× y 1.15×; se descartó 1.15× porque recorta HUD fijo. No quedó demostrada comodidad en tamaños físicos distintos ni teléfono real. Siguiente prueba: emular varios tamaños (960×540, 1280×720, 390×844, 844×390), verificar `Scale.FIT`, proporción, safe areas y controles táctiles; después repetir en dispositivo real. Mantener el lienzo 960×540 y la hitbox explícita durante esta evaluación.
