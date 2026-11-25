# QA — AURALIA Definitive Remaster V2

## Pruebas realizadas al paquete

- `node --check` aplicado a los dos módulos de remasterización y ambos instaladores.
- Instalación V1 + V2 ejecutada en un proyecto de prueba con los fragmentos de código de integración; el JavaScript resultante pasó `node --check`.
- La nueva clase `Achievements` quedó registrada en el listado de escenas y el menú principal quedó actualizado con seis acciones interactivas.
- Las seis zonas de clic del menú se contrastaron visualmente contra la ilustración a 960 × 540 px; no se ha hecho una prueba de clic real en navegador.
- Segunda ejecución del instalador V2 comprobada: no vuelve a duplicar scripts ni modificaciones.
- `.auralia-backups/` queda incluida en `.gitignore` para no subir respaldos locales por accidente.
- Se añadió un publicador PowerShell dirigido al repositorio `serranoandresf`; no se ha ejecutado contra GitHub desde este entorno.
- Los cinco MP3 se generaron y se inspeccionó su duración/formato mediante `ffprobe`.
- La portada social fue exportada a 1200 × 630 px.
- Los dos retratos de selección se exportaron a WebP de 512 × 512 px.
- El fondo del prólogo se exportó a WebP y se comprobó su decodificación.
- Se verificó la lista de recursos que el instalador agrega al precaché del Service Worker.

## Pendiente de ejecutar por el propietario en el proyecto completo

- `node tools/validate_project.cjs` en la copia local del repositorio.
- Carga del juego con Phaser desde navegador real.
- Cambios de música al pasar de región, interruptor y control de volumen.
- Selección y 14 estados de personaje.
- Colisiones y hitboxes después del cambio de escala.
- Recorrido de los quince capítulos y los cinco guardianes.
- Pruebas en Android/iPhone y escritorio.
- Comprobación de la miniatura de WhatsApp, ya que la caché de WhatsApp puede tardar en actualizarse.

**Estado:** parche local preparado. No se afirma que se haya probado el gameplay completo ni que esté publicado.
