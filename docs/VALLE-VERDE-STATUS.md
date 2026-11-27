# GUATAPÉ - Estado de produccion

**Actualizado:** 27 de noviembre de 2026.
**Repositorio:** `serranoandresf/the-kingdom-of-love`.
**Rama de trabajo:** `remaster/valle-verde-production`.
**Ultimo commit remoto base antes de migracion GUATAPE:** `21800ff59f206121c17e61ac9d89c2f20f2f33fa`.
**Base de `main`:** `0a510c8d15b1090e5edf07077f16ea51603a761c`.
**Comparacion remota antes de migracion:** 5 commits por delante y 0 por detras de `main`.
**URL de GitHub Pages conservada:** `https://serranoandresf.github.io/the-kingdom-of-love/`.

## Estado de GitHub

- La rama `remaster/valle-verde-production` existe en GitHub.
- El ultimo commit remoto base verificado antes de esta migracion es `21800ff59f206121c17e61ac9d89c2f20f2f33fa`.
- Commit `2e81c07`: incorpora la biblia del juego y los documentos de produccion.
- Commit `a02bc7d`: corrige la altura de origen del proyectil de VANNESA.
- Commit `a7219a5`: registra las pruebas de combate individuales de ambos protagonistas.
- Commit `b81a88e`: registra la aceptacion automatizada del Capitulo 1 para ANDRES y VANNESA.
- Comparacion remota `main` -> `remaster/valle-verde-production` antes de migrar: 5 commits por delante, 0 por detras; `main` permanece en `0a510c8d15b1090e5edf07077f16ea51603a761c`.
- La rama de trabajo no se ha fusionado y estos cambios no se han desplegado en GitHub Pages.
- El commit `b81a88e` registra la aceptacion automatizada del Capitulo 1 para ANDRES y VANNESA.
- El push de `b81a88e` fue verificado en GitHub; el estado local posterior al push estuvo limpio.

## Identidad y alcance del producto

GUATAPÉ es la identidad oficial vigente. La dirección creativa se define en `docs/GUATAPE-DIRECCION-CREATIVA.md`: fantasía medieval de baja fantasía y steampunk artesanal inspirada en el Pueblo de los Zócalos, el malecón, el embalse, las islas, los caminos de arriería y la Roca del Vigía. La aceptación automatizada anterior del capítulo 1 pertenece al prototipo previo y no valida todavía la nueva ambientación, los recursos gráficos ni los escenarios GUATAPÉ. Los spritesheets, tileset, portada, iconos PWA y recurso Open Graph actuales son provisionales: no desplegar hasta sustituirlos por recursos propios de GUATAPÉ.

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

## Regression mecanica del Capitulo 1 tras migracion GUATAPE - 27 de noviembre de 2026

La identidad y narrativa se migraron en el arbol local de trabajo. Se repitio la prueba automatizada de recorrido completo con Edge, Phaser y WebGL usando `VALLE_VERDE_CAPITULO1_COMPLETO_V2.cjs`. El nombre anterior del archivo pertenece al arnes de pruebas reutilizado; no representa la identidad del producto. Esta ejecucion valida la regresion mecanica bajo los textos y datos nuevos, no la calidad visual ni la ambientacion definitiva de GUATAPE.

| Criterio | ANDRES - Principe Caballero | VANNESA - Princesa |
|---|---:|---:|
| Estado general | PASS | PASS |
| WebGL y recursos cargados | PASS | PASS |
| Primer aterrizaje | PASS | PASS |
| Enemigos derrotados durante el recorrido | 4 de 4 slimes | 4 de 4 slimes |
| Checkpoint X=1200 | PASS | PASS |
| Checkpoint X=2180 | PASS | PASS |
| Transicion al capitulo 2 | PASS | PASS |
| Guardado del siguiente nivel | PASS | PASS |
| Vidas al finalizar | 3 de 3 | 3 de 3 |
| Errores de consola, pagina o solicitudes | 0 | 0 |

ANDRES termino con puntuacion 700 y VANNESA termino con puntuacion 700. Ambos conservaron tres vidas, activaron los dos checkpoints, derrotaron los cuatro slimes y llegaron a `Intermission` con `nextLevel: 1`. La prueba no utilizo eliminaciones forzadas ni teletransporte para completar el recorrido.

Informe JSON local: `%LOCALAPPDATA%\AuraliaQA\reports\valle-verde-ch1-full-playthrough-v2-2026-11-27T15-42-57-195Z.json`.

Capturas locales: `valle-verde-ch1-v2-andres-2026-11-27T15-42-41-617Z.png` y `valle-verde-ch1-v2-vannesa-2026-11-27T15-42-56-710Z.png` dentro de `%LOCALAPPDATA%\AuraliaQA\reports`.

**Alcance y limitacion:** esto confirma que la migracion narrativa no rompio el recorrido mecanico del primer nivel. No acepta los sprites, tileset, portada, iconos, fondos ni recursos sociales como arte final de GUATAPE. Tampoco reemplaza una pasada manual ni una prueba en telefono fisico.
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

1. Hacer una pasada manual del Capitulo 1 con ambos protagonistas y una regresion de muerte, respawn y recuperacion de checkpoints.
2. Desarrollar el piloto visual/funcional definitivo del Capitulo 1 bajo la direccion de arte VALLE VERDE, conservando las mecanicas aceptadas.
3. Continuar con el Capitulo 2 y ampliar la matriz de 30 recorridos de aceptacion.
4. Repetir validacion de PWA/cache, persistencia y controles tactiles despues de cambios importantes.
5. Mantener `main` y GitHub Pages intactas hasta la aprobacion final.