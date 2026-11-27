# VALLE VERDE - Estado de produccion

**Actualizado:** 27 de noviembre de 2026.
**Repositorio:** `serranoandresf/the-kingdom-of-love`.
**Rama de trabajo:** `remaster/valle-verde-production`.
**Commit remoto verificado:** `a02bc7da767b5e2ca4ef693d832d9a503e7f2e84`.
**Base de `main` verificada:** `0a510c8d15b1090e5edf07077f16ea51603a761c`.
**URL de GitHub Pages conservada:** `https://serranoandresf.github.io/the-kingdom-of-love/`.

## Estado de GitHub

- GitHub confirma que `remaster/valle-verde-production` existe y contiene el commit `a02bc7d`.
- Comparacion remota: la rama de trabajo esta 2 commits por delante y 0 commits por detras de `main`.
- Commit `2e81c07`: incorpora la biblia del juego y los documentos de produccion.
- Commit `a02bc7d`: corrige la altura de origen del proyectil de VANNESA.
- `main` permanece en el commit base `0a510c8` en la ultima comparacion verificada.
- No se ha fusionado esta rama ni se ha publicado este cambio en GitHub Pages.
- El ultimo `git status --short` local estuvo limpio despues del push.

## Identidad y alcance del producto

VALLE VERDE es la identidad definida por el Master Production Prompt. La documentacion maestra esta versionada en `docs/`, pero la migracion completa de la identidad visible, interfaz, portada, recursos y mundos a la vision de Medellin sigue pendiente. No asumir que el juego publicado ya refleja el nuevo producto.

El objetivo funcional incluye 5 mundos, 15 capitulos y 5 guardianes. La existencia de datos/configuracion para esas cantidades no demuestra que cada capitulo este terminado ni que todos los jefes puedan derrotarse.

## Pruebas reales de navegador - 27 de noviembre de 2026

Las siguientes pruebas locales utilizaron navegador Edge con Phaser y renderizado WebGL. Los informes JSON y capturas se guardaron en `%LOCALAPPDATA%\AuraliaQA\reports`.

| Prueba | Resultado | Evidencia |
|---|---|---|
| Combate cuerpo a cuerpo de ANDRES | PASS | `VALLE_VERDE_PRUEBA_COMBATE_ANDRES_V3.cjs`; estado `ANDRES_MELEE_KILL_CONFIRMED` |
| Proyectil de VANNESA despues del ajuste de altura | PASS | `VALLE_VERDE_PRUEBA_COMBATE_VANNESA_V4.cjs`; estado `VANNESA_PROJECTILE_KILL_CONFIRMED` |
| Sintaxis de `src/game.js` | PASS | `node --check` sin errores |
| Formato del diff | PASS | `git diff --check` sin errores |
| Validador automatizado del proyecto | PASS | `tools/validate_project.cjs` devolvio `result: PASS` |

### Detalle de combate ANDRES

- Se cargo el juego en WebGL; tileset, hoja de ANDRES, hoja de VANNESA y musica del capitulo cargaron.
- Un ataque cuerpo a cuerpo alcanzo al slime: vida del enemigo de 1 a 0 y destruccion confirmada.
- ANDRES termino con 3 vidas; no se observo Game Over.
- Cero errores de consola, errores de pagina o solicitudes fallidas.

### Detalle de combate VANNESA

- Se cargo el juego en WebGL; tileset, ambas hojas de personaje y musica del capitulo cargaron.
- Un proyectil alcanzo al slime: vida del enemigo de 1 a 0 y destruccion confirmada.
- VANNESA termino con 3 vidas; no se observo Game Over.
- Cero errores de consola, errores de pagina o solicitudes fallidas.
- La correccion cambio el origen vertical del proyectil de `action.origin.y - 2` a `action.origin.y - 20`. La repeticion V4 confirmo un impacto y una eliminacion.

### Otras comprobaciones de movimiento

- En la prueba independiente anterior, VANNESA aterrizo en la primera plataforma: superficie Y=370, cuerpo apoyado en Y=370 y estado `grounded=true`. Esta evidencia cubre ese primer aterrizaje, no todas las plataformas ni todos los saltos.
- La prueba de ANDRES sin atacar registro dano por contacto con enemigos. El ataque cuerpo a cuerpo si funciona; por tanto, recibir dano al chocar sin combatir no se clasifica por si solo como defecto de colision. Falta evaluar tutorial, claridad de controles y balance.

## Validacion automatizada: alcance y limites

El validador informo 5 mundos, 15 capitulos, 5 guardianes y 15 resonadores; reviso sintaxis, ensamblaje de escenas con Phaser simulado, elementos PWA, controles tactiles y capturas exportadas. El propio validador advierte que el ensamblaje simulado no equivale a renderizado o jugabilidad real.

## Pendiente - no afirmar como completado

- Recorrer y completar los 15 capitulos con ANDRES y con VANNESA (30 recorridos de aceptacion).
- Validar checkpoints, muerte/respawn, coleccionables, puertas, resonadores, transiciones y guardado en recorridos completos.
- Probar enemigos de distintos tipos, alturas y velocidades, y confirmar limites/rango del proyectil de VANNESA.
- Validar los cinco jefes y sus patrones con ambos personajes.
- Comprobar la experiencia en un telefono fisico; la emulacion de viewport no reemplaza esta prueba.
- Repetir regresion de PWA/cache y persistencia despues de cambios importantes.
- Implementar la identidad visual definitiva, personajes/vestuario, escenarios y geografia de Medellin descritos en la biblia.
- No fusionar a `main` ni desplegar hasta completar la aceptacion y revisar el resultado visual y jugable.

## Siguiente prioridad

1. Probar el recorrido jugable completo del Capitulo 1 con cada personaje, incluyendo movimiento, primer combate, plataformas, checkpoints y final del nivel.
2. Corregir cualquier defecto reproducible y ampliar pruebas de combate a enemigos en diferentes posiciones.
3. Desarrollar el piloto visual/funcional definitivo del Capitulo 1 bajo la direccion de arte VALLE VERDE.
4. Actualizar este registro con evidencia real despues de cada hito. Mantener `main` y GitHub Pages intactas hasta la aprobacion final.