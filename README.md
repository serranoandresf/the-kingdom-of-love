# THE KINGDOM OF LOVE — ANDRÉS & VANNESA

## AURALIA: LA CANCIÓN DE DOS LUCES

Aventura de plataformas 2D inspirada en la era de 16 bits, con identidad propia, exploración, combate y una mecánica de resonancia. Andrés y Vannesa son protagonistas seleccionables y cada uno tiene habilidades distintas.

## Concepto narrativo

En Auralia, cinco regiones se mantenían en armonía gracias a la Campana del Alba. El Afinador del Silencio quebró su cristal en cinco fragmentos. Andrés y Vannesa recorren rutas distintas para recuperar las notas y devolver la música al reino.

## Mundos

1. Valle de las Campanas.
2. Bosque de las Luciérnagas.
3. Mar de Vidrio.
4. Cumbres del Invierno Azul.
5. Ciudad del Eclipse.

Cada mundo contiene tres capítulos y un guardián en el tercero.

## Ejecutar localmente

- Doble clic en `INICIAR_JUEGO.bat`, o
- Desde PowerShell en la carpeta del proyecto: `python -m http.server 8000`, y abre `http://localhost:8000`.

Se requiere conexión inicial para cargar Phaser 3 desde el CDN. El Service Worker intenta conservar los recursos para visitas posteriores.

## Controles

**Computador:** A/D o flechas para mover; espacio/W/flecha arriba para saltar; Shift para correr; F para la habilidad del personaje; E para activar resonancia cerca de un resonador; Escape para pausar.

**Móvil:** controles táctiles en pantalla: izquierda, derecha, correr, habilidad, resonancia y salto. Se recomienda jugar en horizontal.

## Mecánica de resonancia

Cada capítulo tiene un resonador antiguo. Acércate y pulsa E o el botón ♫. La onda de resonancia revela un puente temporal, aturde enemigos cercanos y puede dañar a un jefe si está dentro del alcance.

## Personalización

Edita `src/config.js` para cambiar nombres, dedicatoria, carta final, recuerdos secretos, antagonista y créditos. Los recuerdos permanecen vacíos por defecto para no inventar detalles de la relación.

## Publicación

El proyecto está preparado para **GitHub Pages con GitHub Actions**. Sigue `PUBLICAR_EN_GITHUB_PAGES.md`. La automatización está en `.github/workflows/pages.yml`.

## Estructura

- `index.html`: entrada web y metadatos sociales.
- `style.css`: interfaz adaptable y controles táctiles.
- `src/config.js`: personalización.
- `src/data.js`: mundos y diseño de quince niveles.
- `src/art.js`: sprites pixel-art procedurales.
- `src/game.js`: escenas, física, combate, resonancia y progreso.
- `src/pwa.js` / `sw.js`: instalación opcional y caché.
- `assets/worlds/`: arte ambiental original.
- `.github/workflows/pages.yml`: despliegue automático.

## Estado de calidad

La estructura, los datos y la sintaxis pueden validarse automáticamente con `node tools/validate_project.cjs`. Eso no sustituye una prueba visual completa con Phaser ni pruebas físicas en Android/iPhone. La versión actual representa una evolución jugable y una primera vertical slice de la dirección Auralia; no debe presentarse todavía como lanzamiento comercial final.
