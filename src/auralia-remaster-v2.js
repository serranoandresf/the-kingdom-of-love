/* AURALIA — Definitive Remaster V2: atmospheric animation layer. */
(() => {
  "use strict";
  const api = window.AURALIA_REMASTER;
  if (!api) {
    console.warn("Auralia Remaster V2: V1 layer not found; V2 atmosphere skipped.");
    return;
  }

  const previousDecorate = api.decorateWorld;

  function addAtmosphere(scene) {
    if (!scene || !scene.add || !scene.world || !scene.levelLength) return;
    const theme = scene.world.theme;
    const palette = {
      meadow: { primary: 0xffe5a4, secondary: 0xf4b6d4, accent: 0xffffff },
      forest: { primary: 0xc8ff9b, secondary: 0xffe68d, accent: 0xb6f4cf },
      sea: { primary: 0xbafcff, secondary: 0x7ed7ef, accent: 0xffffff },
      winter: { primary: 0xe9f8ff, secondary: 0x9de6ff, accent: 0xffffff },
      eclipse: { primary: 0xdca1ff, secondary: 0xffc17d, accent: 0xffe1c8 }
    }[theme] || { primary: 0xffe5a4, secondary: 0xffffff, accent: 0xffffff };

    // Small, deterministic ambient objects: low object count, no physics bodies.
    const count = theme === "winter" ? 15 : 12;
    for (let i = 0; i < count; i++) {
      const x = 70 + i * Math.max(145, (scene.levelLength - 140) / count);
      const y = 100 + ((i * 83) % 285);
      const color = i % 3 === 0 ? palette.secondary : palette.primary;
      let mote;
      if (theme === "sea") {
        mote = scene.add.circle(x, y, i % 4 === 0 ? 4 : 2.5, color, 0.30)
          .setStrokeStyle(1, palette.accent, 0.48);
      } else if (theme === "winter") {
        mote = scene.add.star(x, y, 4, 1.5, 3.4, color, 0.58);
      } else if (theme === "eclipse") {
        mote = scene.add.circle(x, y, i % 4 === 0 ? 3 : 2, color, 0.58);
      } else {
        mote = scene.add.circle(x, y, i % 4 === 0 ? 3 : 2, color, 0.62);
      }
      mote.setDepth(4.4).setScrollFactor(theme === "meadow" ? 0.70 : 0.78);
      scene.tweens.add({
        targets: mote,
        x: x + (i % 2 === 0 ? 12 : -10),
        y: y - (theme === "winter" ? 34 : 18 + (i % 3) * 7),
        alpha: theme === "sea" ? 0.08 : 0.12,
        scale: theme === "sea" ? 1.35 : 1.15,
        duration: 1650 + i * 117,
        delay: i * 93,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut"
      });
    }

    // A few themed light accents add depth without obstructing the playable plane.
    if (theme === "meadow") {
      for (let i = 0; i < 5; i++) {
        const glow = scene.add.circle(520 + i * 105, 185 + (i % 2) * 38, 24 + (i % 3) * 7, 0xffdf98, 0.055)
          .setDepth(-1.5).setScrollFactor(0.28);
        scene.tweens.add({ targets: glow, alpha: 0.12, scale: 1.18, duration: 2100 + i * 210, yoyo: true, repeat: -1 });
      }
    } else if (theme === "forest") {
      for (let i = 0; i < 8; i++) {
        const x = 130 + i * Math.max(250, (scene.levelLength - 260) / 8);
        const glow = scene.add.circle(x, 315 + (i % 3) * 36, 8, 0xcfff91, 0.11).setDepth(1.8).setScrollFactor(0.66);
        scene.tweens.add({ targets: glow, alpha: 0.42, scale: 1.45, duration: 1100 + i * 170, yoyo: true, repeat: -1, delay: i * 120 });
      }
    } else if (theme === "sea") {
      for (let i = 0; i < 7; i++) {
        const x = 170 + i * Math.max(300, (scene.levelLength - 340) / 7);
        const glint = scene.add.ellipse(x, 431 - (i % 3) * 25, 38, 3, 0xd7ffff, 0.23).setDepth(2.1).setScrollFactor(0.88);
        scene.tweens.add({ targets: glint, x: x + 34, alpha: 0.04, scaleX: 0.55, duration: 1900 + i * 150, yoyo: true, repeat: -1, delay: i * 110 });
      }
    } else if (theme === "winter") {
      const aurora = scene.add.ellipse(720, 120, 300, 74, 0x85dce8, 0.045).setDepth(-1.2).setScrollFactor(0.18);
      scene.tweens.add({ targets: aurora, scaleX: 1.25, scaleY: 1.12, alpha: 0.10, duration: 3400, yoyo: true, repeat: -1 });
    } else if (theme === "eclipse") {
      const halo = scene.add.circle(760, 132, 104, 0x9d6fc1, 0.06).setDepth(-1.3).setScrollFactor(0.16);
      halo.setStrokeStyle(2, 0xe7c08b, 0.19);
      scene.tweens.add({ targets: halo, alpha: 0.13, scale: 1.08, duration: 2700, yoyo: true, repeat: -1 });
    }
  }

  api.decorateWorld = function (scene) {
    if (typeof previousDecorate === "function") previousDecorate(scene);
    try { addAtmosphere(scene); }
    catch (error) { console.warn("Auralia Remaster V2 atmosphere skipped:", error); }
  };
  api.version = "2.0.0";
})();
