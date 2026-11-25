# Evidencia de gameplay — capítulo 1

Capturas directas del canvas Phaser 3.80.1 a su tamaño lógico nativo de 960 × 540.

- capitulo-1-andres.png: Valle de las Campanas, nivel 1/15, Andrés.
- capitulo-1-vannesa.png: Valle de las Campanas, nivel 1/15, VANNESA.

Se generaron con el snapshot del renderer WebGL, no con un mockup o arte compuesto fuera del juego. Ambas imágenes se reabrieron y verificaron visualmente; los archivos incluyen el HUD, la escena activa y el protagonista renderizado.

El estado de las capturas es un arranque del capítulo. No documentan un recorrido completo, el resultado de un combate ni la finalización del nivel.

Las muestras de reposo exportadas durante esta sesión son `personajes/andres-idle-f0.png` y `personajes/vannesa-idle-f0.png`; resolución 960 × 540, capturadas del renderer WebGL mediante Phaser `Renderer.snapshot`. Los archivos retratan al personaje dentro del capítulo y su HUD, no hojas maestras aisladas. El inspector confirmó hoja de tiles SVG (24 cuadros) y ambos atlas PNG activos. La auditoría visual, capturas y límites de aceptación se encuentran en `REGISTRO_PRUEBAS_AURALIA.md` y `PERSONAJES_MAESTROS_AURALIA.md`.
