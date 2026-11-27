# VALLE VERDE - Estado de produccion

**Actualizado:** 27 de noviembre de 2026.
**Repositorio:** `serranoandresf/the-kingdom-of-love`.
**Rama de trabajo:** `remaster/valle-verde-production`.
**Ultimo commit remoto confirmado antes de esta actualizacion:** `a7219a569a7e427551cc4a0b0fd9d23c69efca50`.
**Base de `main`:** `0a510c8d15b1090e5edf07077f16ea51603a761c`.
**Comparacion remota antes de esta actualizacion:** 3 commits por delante y 0 por detras de `main`.
**URL de GitHub Pages conservada:** `https://serranoandresf.github.io/the-kingdom-of-love/`.

## Estado de GitHub

- La rama `remaster/valle-verde-production` existe en GitHub.
- El ultimo commit remoto verificado es `a7219a569a7e427551cc4a0b0fd9d23c69efca50`.
- Commit `2e81c07`: incorpora la biblia del juego y los documentos de produccion.
- Commit `a02bc7d`: corrige la altura de origen del proyectil de VANNESA.
- Commit `a7219a5`: registra las pruebas de combate individuales de ambos protagonistas.
- `main` permanece en `0a510c8d15b1090e5edf07077f16ea51603a761c` en la ultima comparacion remota.
- La rama de trabajo no se ha fusionado y estos cambios no se han desplegado en GitHub Pages.
- La ultima verificacion local despues del push de `a7219a5` mostro un arbol de trabajo limpio.

## Identidad y alcance del producto

VALLE VERDE es la identidad definida por el Master Production Prompt. La documentacion maestra esta versionada en `docs/`, pero la migracion completa de la identidad visible, interfaz, portada, recursos, personajes y mundos a la vision de Medellin sigue pendiente. No asumir que el juego publicado ya refleja el nuevo producto.

El objetivo funcional incluye 5 mundos, 15 capitulos y 5 guardianes. La existencia de datos/configuracion para esas cantidades no demuestra que cada capitulo este terminado ni que todos los jefes puedan derrotarse.

## Pruebas reales de navegador - 27 de noviembre de 2026

Las pruebas automatizadas de navegador se ejecutaron localmente en Edge con Phaser y renderizado WebGL. Los informes JSON y capturas se guardaron en `%LOCALAPPDATA%\AuraliaQA\reports`.

### Combate individual

| Prueba | Resultado | Evidencia |
|---|---|---|
| Ataque cuerpo a cuerpo de ANDRES | PASS | `VALLE_VERDE_PRUEBA_COMBATE_ANDRES_V3.cjs`; `ANDRES_MELEE_KILL_CONFIRMED` |
| Proyectil de VANNESA | PASS | `VALLE_VERDE_PRUEBA_COMBATE_VANNESA_V4.cjs`; `VANNESA_PROJECTILE_KILL_CONFIRMED` |
| Diagnostico controlado de ambos ataques | PASS | `VALLE_VERDE_DIAGNOSTICO_COMBATE_V3.cjs`; `ENEMY_KILL_CONFIRMED` para ambos protagonistas |

### Recorrido completo del Capitulo 1 - V2

Informe principal: `valle-verde-ch1-full-playthrough-v2-2026-11-27T14-14-45-096Z.json`.
Estado general: `BOTH_CHARACTERS_CHAPTER1_PASS`.

| Criterio | ANDRES | VANNESA |
|---|---:|---:|
| WebGL y recursos | PASS | PASS |
| Aterrizaje en primera plataforma | PASS | PASS |
| Derroto al menos un enemigo durante el recorrido | PASS | PASS |
| Cuatro slimes derrotados | 4 de 4 | 3 de 4 (objetivo opcional) |
| Checkpoint X=1200 | PASS | PASS |
| Checkpoint X=2180 | PASS | PASS |
| Transicion a Intermission / capitulo 2 | PASS | PASS |
| Progreso guardado en nivel 1 | PASS | PASS |
| Supervivencia al completar | 3 vidas | 3 vidas |
| Errores de consola, pagina o solicitudes | 0 | 0 |
| Tiempo de esta ejecucion automatizada | 15691 ms | 14967 ms |

Los tiempos anteriores corresponden a la automatizacion y no son una medicion de duracion normal para una persona jugando.

ANDRES elimino los cuatro slimes del capitulo. VANNESA elimino tres; eliminar el cuarto se mantiene como objetivo opcional y no bloquea la salida del nivel. Ambos activaron los dos checkpoints y llegaron a `Intermission` con tres vidas. El guardado reporto `level: 1` y el protagonista correspondiente.

### Correccion de la interpretacion del primer recorrido V1

El primer comprobador V1 no mantenia la entrada de ataque el tiempo suficiente para que la entrada se registrara de forma fiable en todos los casos. Ademas, tras cambiar a `Intermission`, intentaba leer las vidas desde un jugador que ya no estaba activo. Por ello, V1 se conserva como diagnostico historico y no como criterio de aceptacion final. V2 mantiene `F` durante 180 ms y utiliza `lastCompletion`/datos guardados para evaluar la salida de escena.

### Comprobaciones tecnicas adicionales

- `node --check src/game.js`: PASS.
- `git diff --check`: PASS en las modificaciones de codigo y documentacion probadas.
- `node tools/validate_project.cjs`: PASS, con la limitacion declarada de que el ensamblaje simulado no sustituye pruebas reales.
- Las pruebas V2 de recorrido completo reportaron cero errores de consola, errores de pagina y solicitudes fallidas.
- El aterrizaje inicial de ambos personajes se verifico con el cuerpo apoyado sobre la superficie de la primera plataforma, Y=370.

## Pendiente - no afirmar como completado

- Completar y aceptar los 15 capitulos con ambos personajes (30 recorridos de aceptacion).
- Probar la muerte/respawn, los checkpoints recuperados tras morir, plataformas moviles, bloques rompibles, coleccionables, mecanismos y guardado durante recorridos completos.
- Validar los cinco jefes, sus fases/patrones y sus derrotas con ambos personajes.
- Ampliar la matriz de combate con enemigos de distintos tipos, alturas, velocidades y distancias; incluir el enemigo opcional no derrotado por VANNESA en esta ejecucion.
- Validar el capitulo 1 mediante juego humano/manual, ademas de la automatizacion de navegador.
- Comprobar la experiencia en un telefono fisico; la emulacion de viewport no reemplaza esta prueba.
- Repetir regresion de PWA/cache y persistencia despues de cambios importantes.
- Implementar la identidad visual definitiva, personajes/vestuario, escenarios y geografia de Medellin descritos en la biblia.
- No fusionar a `main` ni desplegar hasta completar la aceptacion de producto, pruebas manuales y revision visual/jugable.

## Siguiente prioridad

1. Registrar y versionar este resultado de aceptacion de Capitulo 1 para ANDRES y VANNESA.
2. Hacer una pasada manual del capitulo 1 y una regresion de respawn/checkpoints, sin alterar la evidencia automatizada ya conseguida.
3. Desarrollar el piloto visual/funcional definitivo del Capitulo 1 bajo la direccion de arte VALLE VERDE.
4. Continuar con el capitulo 2 y ampliar la matriz de 30 recorridos de aceptacion.
5. Mantener `main` y GitHub Pages intactas hasta la aprobacion final.