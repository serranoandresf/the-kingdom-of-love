# GUATAPÉ — ANDRÉS, Príncipe Caballero & VANNESA, Princesa

## Una aventura de fantasía entre zócalos, montañas y aguas

GUATAPÉ es una aventura 2D de plataformas, combate ligero, exploración, acertijos y resonancia rúnica. Reimagina el pueblo de Guatapé y el paisaje del embalse en un universo medieval de baja fantasía y steampunk artesanal: madera, piedra, cobre, hierro forjado, vapor azul y cristales rúnicos.

ANDRÉS es el Príncipe Caballero y utiliza espada y Pulso Dorado. VANNESA es la Princesa y domina la Resonancia Azul, los proyectiles rúnicos y el doble salto. Ambos pueden completar la campaña.

## Campaña

Cinco regiones y quince capítulos:

1. El Pueblo de los Zócalos.
2. El Malecón de las Mil Velas.
3. Las Islas del Embalse.
4. Los Caminos de Arriería.
5. La Roca del Vigía.

Cada región contiene tres capítulos y termina con un guardián. Las misiones secundarias incluyen la Calle del Recuerdo, el Planchón de Bronce, el Torneo de los Zócalos y las rutas de arriería.

La ambientación es una fantasía alternativa. La tecnología de vapor y la magia rúnica son inventadas; no deben confundirse con la historia real de Guatapé. La historia del embalse y sus impactos se trata con respeto.

## Ejecutar localmente

- Doble clic en `INICIAR_JUEGO.bat`, o
- Desde PowerShell en la carpeta del proyecto: `python -m http.server 8000`, y abre `http://localhost:8000`.

Se requiere conexión inicial para cargar Phaser 3 desde el CDN. El Service Worker intenta conservar los recursos para visitas posteriores.

## Controles

**Computador:** A/D o flechas para mover; espacio/W/flecha arriba para saltar; Shift para correr; F para la habilidad del personaje; E para activar resonancia cerca de un resonador; Escape para pausar.

**Móvil:** controles táctiles en pantalla: izquierda, derecha, correr, habilidad, resonancia y salto. Se recomienda jugar en horizontal.

## Estado de producción

La aceptación automatizada anterior del capítulo 1 corresponde al prototipo previo. No constituye aprobación de los nuevos escenarios, personajes, portada ni ambientación de GUATAPÉ. El cambio actual conserva provisionalmente la geometría y la lógica probada; requiere una nueva pasada visual, de navegador y de juego manual.

Los spritesheets, tileset, portada, iconos PWA y recurso Open Graph actuales son provisionales y deben sustituirse por arte específico de GUATAPÉ antes de cualquier publicación. La rama de trabajo continúa siendo `remaster/valle-verde-production`; no se ha cambiado `main` ni la URL técnica de GitHub Pages.

## Estructura

- `index.html`: entrada web y metadatos.
- `style.css`: interfaz adaptable y controles táctiles.
- `src/config.js`: nombre, dedicatoria, carta y créditos.
- `src/data.js`: cinco regiones y quince capítulos.
- `src/art.js`: arte procedural temporal.
- `src/auralia-remaster.js` y `src/auralia-remaster-v2.js`: capa interna de animaciones heredada; el nombre es técnico, no visible en el producto.
- `src/game.js`: escenas, física, combate, resonancia y progreso.
- `src/pwa.js` / `sw.js`: instalación opcional y caché.
- `docs/GUATAPE-DIRECCION-CREATIVA.md`: dirección creativa vigente.
- `.github/workflows/pages.yml`: despliegue de GitHub Pages; no desplegar hasta aprobar el nuevo arte y la regresión.

Ejecutar `node tools/validate_project.cjs` para comprobaciones automatizadas. Estas no sustituyen una prueba visual con Phaser, recorridos manuales ni validación en teléfono físico.