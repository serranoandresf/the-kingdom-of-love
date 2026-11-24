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

- El entorno de validación no pudo resolver el host de jsDelivr (`cdn.jsdelivr.net`), por lo que no pudo cargar Phaser ni realizar una captura de navegador real.
- No se recorrieron manualmente los quince capítulos.
- No se probaron teléfonos físicos Android o iPhone.
- Los personajes de juego todavía utilizan sprites procedurales como base. Las referencias de spritesheets están incluidas, pero no se han convertido en animaciones de producción completas.
- El arte de fondo dedicado y el menú nuevo están integrados para Auralia/Valle; las otras cuatro regiones aún requieren fondos de producción propios.
- La URL pública no puede fijarse hasta que el propietario cree el repositorio y GitHub Pages asigne el dominio.

## Estado

**V5: vertical slice conceptual y mecánica de Auralia implementadas en la base existente; lista para subir a un repositorio GitHub y continuar el ciclo de pruebas. No es todavía un lanzamiento comercial verificado.**
