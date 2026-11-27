# VALLE VERDE — Plan de calidad y aceptación

## 1. Estados de validación

- **No iniciado:** no existe implementación.
- **En análisis:** se está inspeccionando diseño/código.
- **En desarrollo:** cambios en curso.
- **Implementado:** código/recurso integrado, sin aceptación completa.
- **Compilado:** supera comprobación de sintaxis/build pertinente.
- **Probado automáticamente:** pruebas automatizadas pertinentes ejecutadas.
- **Probado en navegador:** ejecución observada en navegador real o automatización de navegador.
- **Validado jugablemente:** secuencia reproducible completada y registrada.
- **Aceptado:** criterios de salida cumplidos con evidencia.
- **Bloqueado:** depende de permisos, recursos o una corrección previa.

No mezclar estados ni convertir una prueba de carga en una prueba de recorrido.

## 2. Línea base conocida

La versión publicada en `main` tiene commit base `0a510c8d15b1090e5edf07077f16ea51603a761c`. Los informes heredados declaran: cinco regiones, quince capítulos, cinco guardianes y quince resonadores configurados; JavaScript pasa `node --check`; Phaser 3.80.1 se cargó con WebGL en una sesión de Edge; se observaron recursos y movimiento horizontal de ambos personajes.

Los mismos informes indican que la validación de estructura con Phaser simulado no demuestra renderizado/physics real ni completitud de capítulos. No se recorrieron los quince capítulos ni se probó hardware móvil físico.

## 3. Defectos heredados prioritarios

1. ANDRÉS pasó de tres vidas a cero por `enemy-contact` antes de llegar a x≈550/checkpoint, sin derrota de enemigo registrada.
2. VANNESA saltó, pero no se confirmó el aterrizaje sobre la primera plataforma.
3. Una captura de VANNESA que parecía inicial mostraba Game Over y fue reclasificada como evidencia diagnóstica inválida.
4. El remaster anterior aún tiene arte provisional y ciclos incompletos.

Estos defectos siguen abiertos hasta reproducir, corregir y repetir la prueba en navegador.

## 4. Pruebas de personaje/física

Para cada protagonista: spawn y estado grounded; movimiento a izquierda/derecha; cámara; salto desde suelo; altura máxima; control de salto sostenido; trayectoria; aterrizaje en plataforma; segundo salto de VANNESA; imposibilidad de segundo salto de ANDRÉS si la regla no lo permite; colisión de suelo; plataformas móviles; retroceso por daño; invulnerabilidad; recuperación; caída y respawn en checkpoint.

Registrar coordenadas, velocidades, `body` bounds, flags `blocked/touching`, `jumpCount`, vidas, fuente de daño, tiempo, checkpoint y captura de evidencia.

## 5. Pruebas de combate

Enemigo detecta al jugador; señal anticipada; contacto causa daño solo cuando corresponde; no se repite daño durante invulnerabilidad; salto desde arriba derrota/daña con criterio geométrico verificable; habilidad funciona; enemigo se mueve y colisiona con suelo; reacción y derrota visibles; jefe recibe daño y respeta cooldown; victoria abre recompensa y siguiente escena.

## 6. Matriz de aceptación por capítulo

Cada uno de los quince capítulos debe ser completado por ANDRÉS y VANNESA. Registrar 30 recorridos de aceptación con:

- Inicio sin error y assets cargados.
- Ruta obligatoria alcanzable.
- Saltos y aterrizajes válidos.
- Enemigos y mecanismos funcionales.
- Resonador y objetivo activables.
- Checkpoint activado y recuperable.
- Jefe derrotado en capítulos 3/6/9/12/15.
- Transición correcta al capítulo siguiente.
- Sin softlock, caída fuera de mapa o Game Over injustificado.
- Guardado persistente después de recargar.

Los secretos opcionales se prueban aparte; no deben ser requisito de salida salvo que el diseño los marque obligatorios.

## 7. Pruebas técnicas

- `node --check` para archivos JS/CJS.
- Validación de referencias de assets, metadatos, manifest, service worker y workflow.
- Pruebas automatizadas de funciones puras/sistemas aislados.
- Edge y Chrome en escritorio.
- Viewports 1920×1080, 1366×768, 960×540, 390×844 y 844×390 como mínimo.
- Carga HTTP de assets sin 404.
- Consola sin errores críticos.
- Guardado después de refresh.
- PWA/caché: nueva versión visible después de actualizar y caché antigua invalidada sin pérdida de partida.
- Rendimiento medido, no afirmado; objetivo 60 FPS en equipo compatible.
- Móvil físico solo se marca validado cuando se prueba físicamente.

## 8. Regla de publicación

No publicar como definitiva una versión con capítulos obligatorios imposibles, errores críticos, recursos rotos, personajes provisionales o pruebas no realizadas declaradas como aprobadas. Mantener las limitaciones y las evidencias en el registro.
