# V5 — Auralia y GitHub Pages

## Cambios principales
- Dirección narrativa sustituida por Auralia y la Campana del Alba.
- Cinco regiones retituladas y quince textos de capítulo reescritos.
- Nuevo prólogo interactivo después de elegir protagonista.
- Sistema de resonadores por capítulo: onda visual/sonora, puente de eco, aturdimiento cercano y daño adicional al guardián si está en alcance.
- Aparición fugaz del eco del otro protagonista al activar resonancia.
- Cinco texturas procedurales distintas para los guardianes.
- Arte panorámico dedicado al Valle de las Campanas y nuevo arte de portada.
- Control de resonancia en teclado (E) y pantalla táctil (♫).
- Guardado ampliado con los cinco fragmentos.
- Netlify eliminado del flujo; GitHub Actions publica automáticamente desde `main`.
- Configurador de URL canónica y vista previa social de GitHub Pages.

## Validación realizada
- `node --check` en los archivos JavaScript.
- Carga de `data.js` y comprobación de cinco regiones, quince capítulos, cinco guardianes y resonadores.
- Comprobación de archivos, rutas locales, manifiesto PWA, metadatos sociales y workflow de GitHub Pages.
- Evaluación del ensamblaje de escenas con un contenedor simulado de Phaser.

## Pendiente antes de lanzamiento
- Ejecutar Phaser real en navegador con acceso al CDN (el entorno de validación no pudo resolver `cdn.jsdelivr.net`).
- Recorrer manualmente los quince capítulos.
- Probar Android y iPhone físicos.
- Sustituir progresivamente sprites procedurales por spritesheets de producción animados.
- Crear fondos propios para las cuatro regiones restantes.
- Configurar la URL pública exacta después de crear el repositorio.
