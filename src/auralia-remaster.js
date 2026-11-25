/*
 * AURALIA — Definitive Remaster visual pass (v1)
 * Drop-in Phaser 3 texture upgrade. Keeps the original texture keys so
 * existing gameplay, collision logic and animation selection remain intact.
 */
(() => {
  "use strict";
  const base = window.LOVE_GAME_ART;
  if (!base || typeof base.create !== "function") {
    console.warn("Auralia Remaster: base art module not found; keeping original art.");
    return;
  }

  const POSES = ["idle", "walk1", "walk2", "run1", "run2", "jump", "fall", "land", "attack", "special", "resonance", "hurt", "victory", "cast"];
  const SCALE = 2;
  const C = {
    outline: "#201b2d", shadow: "#332238", skin: "#d99a78", skinLight: "#f2c09e",
    skinShade: "#b97462", hair: "#211b27", hairMid: "#3d2c3d", hairHi: "#70506a",
    blue: "#244d89", blue2: "#3976bd", blueHi: "#76a8e3", gold: "#f1c76d",
    goldHi: "#fff0b3", ivory: "#fff0dc", leather: "#49352f", cape: "#553b72",
    capeHi: "#8061a0", eye: "#2a2637", white: "#fff9e9", rose: "#cf7f88",
    magic: "#d995ff", magicHi: "#fff0ff"
  };

  function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(x, y, w, h); }
  function poly(c, points, color) {
    c.fillStyle = color; c.beginPath(); c.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) c.lineTo(points[i][0], points[i][1]);
    c.closePath(); c.fill();
  }
  function line(c, x1, y1, x2, y2, color, width = 1) {
    c.strokeStyle = color; c.lineWidth = width; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
  }

  // Both heroes are drawn on a 64x96 native canvas (2x the original art).
  // The extra one- and two-pixel accents are real detail, not a blur filter.
  function drawAndres(c, pose) {
    const step = pose === "walk1" ? 2 : pose === "walk2" ? -2 : pose === "run1" ? 4 : pose === "run2" ? -4 : 0;
    c.save(); c.scale(SCALE, SCALE);
    // Rear cape, boots and legs.
    poly(c, [[9,15],[4,18],[2,33],[7,40],[13,30],[14,18]], C.cape);
    poly(c, [[9,18],[5,22],[5,34],[8,35],[12,25]], C.capeHi);
    rect(c, 8, 37 + step, 7, 8, C.outline); rect(c, 8, 43 + step, 10, 4, C.leather);
    rect(c, 19, 37 - step, 7, 8, C.outline); rect(c, 18, 43 - step, 11, 4, C.leather);
    rect(c, 9, 40 + step, 5, 1, "#b78a65"); rect(c, 20, 40 - step, 5, 1, "#b78a65");
    // Arms and blue adventurer's tunic.
    rect(c, 7, 21, 5, 12, C.skin); rect(c, 22, 21, 5, 12, C.skin);
    rect(c, 7, 28, 5, 6, C.leather); rect(c, 22, 28, 5, 6, C.leather);
    rect(c, 9, 18, 15, 20, C.blue); rect(c, 7, 20, 19, 4, C.blue2);
    poly(c, [[10,19],[16,22],[22,19],[21,25],[11,25]], C.blueHi);
    rect(c, 9, 32, 15, 3, C.gold); rect(c, 14, 33, 5, 3, "#9b642d");
    rect(c, 12, 21, 9, 3, C.gold); rect(c, 14, 25, 5, 4, C.cape);
    rect(c, 8, 24, 3, 7, C.blueHi); rect(c, 22, 24, 3, 7, C.blueHi);
    // Neck and face.
    rect(c, 14, 14, 6, 5, C.skinShade); rect(c, 10, 5, 13, 14, C.skinLight);
    rect(c, 10, 12, 2, 4, C.skin); rect(c, 22, 12, 2, 4, C.skin);
    // Dense, curly dark hair.
    rect(c, 9, 4, 14, 4, C.hair); rect(c, 7, 7, 4, 5, C.hair); rect(c, 20, 6, 5, 5, C.hair);
    rect(c, 11, 2, 4, 4, C.hair); rect(c, 16, 1, 4, 5, C.hair); rect(c, 21, 3, 3, 4, C.hair);
    rect(c, 8, 5, 4, 3, C.hairMid); rect(c, 13, 2, 3, 2, C.hairMid); rect(c, 18, 2, 3, 2, C.hairMid);
    // Brows, beard and a compact sword silhouette.
    rect(c, 12, 10, 4, 1, C.shadow); rect(c, 18, 10, 4, 1, C.shadow);
    rect(c, 13, 11, 2, 2, C.eye); rect(c, 19, 11, 2, 2, C.eye);
    rect(c, 16, 13, 2, 2, C.skinShade);
    rect(c, 12, 15, 10, 4, C.shadow); rect(c, 13, 14, 2, 2, C.shadow); rect(c, 19, 14, 2, 2, C.shadow);
    if (pose === "attack") { rect(c, 25, 22, 5, 3, C.gold); rect(c, 28, 17, 2, 13, "#dceeff"); }
    if (pose === "jump" || pose === "fall") { rect(c, 8, 36, 8, 5, C.outline); rect(c, 18, 36, 8, 5, C.outline); if (pose === "fall") rect(c, 4, 25, 4, 7, C.cape); }
    if (pose === "hurt") { rect(c, 8, 12, 4, 3, C.shadow); rect(c, 18, 12, 4, 3, C.shadow); rect(c, 8, 22, 4, 9, C.gold); }
    if (pose === "victory") { rect(c, 22, 5, 5, 12, C.gold); rect(c, 23, 1, 4, 5, C.goldHi); }
    if (pose === "land") { rect(c, 4, 43, 7, 2, "#d9b889"); rect(c, 22, 43, 7, 2, "#d9b889"); rect(c, 3, 40, 3, 2, C.goldHi); rect(c, 27, 40, 3, 2, C.goldHi); }
    if (pose === "special") { rect(c, 24, 20, 8, 4, C.goldHi); rect(c, 29, 15, 2, 15, "#f4fbff"); rect(c, 26, 17, 2, 3, C.blueHi); }
    if (pose === "resonance") { c.strokeStyle = "#ffe5a0"; c.lineWidth = 1.5; c.beginPath(); c.arc(16, 27, 18, Math.PI * 1.12, Math.PI * 1.88); c.stroke(); c.beginPath(); c.arc(16, 27, 23, Math.PI * 1.12, Math.PI * 1.88); c.stroke(); rect(c, 14, 8, 4, 3, C.goldHi); }
    if (pose === "run1" || pose === "run2") { poly(c, [[6, 17], [1, 21], [0, 31], [6, 29], [12, 22]], C.capeHi); }
    c.restore();

    // Fine native-resolution face details: brows, iris, nose, beard texture and curls.
    rect(c, 24, 21, 4, 2, "#6f4a42"); rect(c, 37, 21, 4, 2, "#6f4a42");
    rect(c, 25, 23, 3, 4, C.white); rect(c, 38, 23, 3, 4, C.white);
    rect(c, 27, 24, 2, 3, "#4b6d86"); rect(c, 39, 24, 2, 3, "#4b6d86");
    rect(c, 28, 24, 1, 1, C.white); rect(c, 40, 24, 1, 1, C.white);
    rect(c, 32, 28, 3, 5, C.skinShade); rect(c, 34, 29, 2, 2, "#f4c09d");
    rect(c, 27, 33, 13, 5, C.shadow); rect(c, 29, 34, 9, 2, "#4a3035");
    rect(c, 28, 38, 3, 2, "#513744"); rect(c, 34, 39, 2, 2, "#513744");
    rect(c, 39, 37, 2, 2, "#513744"); rect(c, 31, 41, 3, 1, "#513744");
    rect(c, 19, 13, 3, 2, C.skin); rect(c, 43, 13, 2, 3, C.skin);
    // Curl highlights and sculpted hair edge.
    [[22,8],[29,5],[38,6],[45,9],[19,17],[45,18]].forEach(([x,y]) => rect(c,x,y,3,2,C.hairMid));
    rect(c, 28, 9, 4, 1, C.hairHi); rect(c, 38, 8, 4, 1, C.hairHi); rect(c, 47, 13, 2, 5, C.hairMid);
    // Leather stitching, gold trim and cloth folds.
    line(c, 22, 49, 42, 49, C.goldHi, 1); line(c, 20, 55, 20, 67, "#6b99d1", 1);
    line(c, 43, 55, 43, 67, "#6b99d1", 1); rect(c, 28, 63, 8, 3, C.goldHi);
    rect(c, 27, 70, 3, 2, "#d5ae7d"); rect(c, 39, 70, 3, 2, "#d5ae7d");
    if (pose === "cast" || pose === "victory") { rect(c, 48, 43, 7, 7, "#fff0a8"); rect(c, 50, 40, 3, 13, C.gold); }
  }

  function drawVannesa(c, pose) {
    const step = pose === "walk1" ? 2 : pose === "walk2" ? -2 : pose === "run1" ? 4 : pose === "run2" ? -4 : 0;
    c.save(); c.scale(SCALE, SCALE);
    // Long hair behind shoulders and flowing dress.
    rect(c, 7, 7, 5, 23, C.hair); rect(c, 21, 7, 5, 23, C.hair);
    rect(c, 8, 16, 4, 17, C.hairMid); rect(c, 21, 16, 4, 17, C.hairMid);
    poly(c, [[10,19],[22,19],[28,41],[4,41]], C.blue);
    poly(c, [[13,19],[19,19],[22,38],[10,38]], C.ivory);
    rect(c, 8, 22, 4, 10, C.skinLight); rect(c, 22, 22, 4, 10, C.skinLight);
    rect(c, 8, 29, 4, 4, C.ivory); rect(c, 22, 29, 4, 4, C.ivory);
    poly(c, [[7,40],[25,40],[27,44],[5,44]], "#17375f");
    rect(c, 7, 39 + step, 7, 5, "#e9c8a5"); rect(c, 19, 39 - step, 7, 5, "#e9c8a5");
    rect(c, 8, 42 + step, 7, 3, C.gold); rect(c, 19, 42 - step, 7, 3, C.gold);
    // Bodice, neckline, belt and embroidered waist jewel.
    rect(c, 12, 19, 8, 12, "#f8e7d0");
    poly(c, [[12,19],[16,22],[20,19],[20,27],[12,27]], C.blue2);
    rect(c, 11, 29, 10, 2, C.gold); rect(c, 14, 29, 4, 3, C.goldHi);
    // Face and center-parted dark hair.
    rect(c, 10, 5, 13, 14, C.skinLight); rect(c, 8, 11, 3, 5, C.skinLight); rect(c, 22, 11, 3, 5, C.skinLight);
    rect(c, 8, 4, 16, 5, C.hair); rect(c, 7, 7, 4, 10, C.hair); rect(c, 21, 7, 4, 10, C.hair);
    rect(c, 10, 3, 5, 3, C.hairMid); rect(c, 17, 3, 5, 3, C.hairMid); rect(c, 15, 3, 1, 5, C.skin);
    // Eyes, lashes and mouth.
    rect(c, 12, 10, 4, 1, C.shadow); rect(c, 18, 10, 4, 1, C.shadow);
    rect(c, 13, 11, 2, 2, C.eye); rect(c, 19, 11, 2, 2, C.eye);
    rect(c, 16, 14, 2, 2, C.skinShade); rect(c, 14, 17, 6, 1, C.rose);
    // Golden tiara.
    poly(c, [[10,6],[11,1],[14,5],[16,0],[19,5],[22,2],[23,7]], C.gold);
    rect(c, 11, 6, 12, 2, C.gold); rect(c, 15, 3, 2, 2, C.magicHi);
    if (pose === "attack") { rect(c, 25, 20, 5, 5, C.magic); rect(c, 27, 18, 3, 3, C.magicHi); }
    if (pose === "jump" || pose === "fall") { rect(c, 5, 35, 4, 5, C.magic); rect(c, 25, 35, 4, 5, C.magic); }
    if (pose === "hurt") { rect(c, 10, 12, 4, 2, C.shadow); rect(c, 18, 12, 4, 2, C.shadow); rect(c, 24, 26, 5, 5, C.magic); }
    if (pose === "victory") { rect(c, 24, 13, 4, 12, "#e4a0ff"); rect(c, 23, 9, 6, 5, C.gold); }
    if (pose === "cast" || pose === "special") { rect(c, 24, 22, 8, 8, C.magic); rect(c, 26, 20, 4, 4, C.magicHi); if (pose === "special") { rect(c, 27, 14, 3, 4, C.goldHi); rect(c, 30, 18, 3, 2, C.magicHi); } }
    if (pose === "land") { rect(c, 3, 42, 7, 2, "#ead6c4"); rect(c, 22, 42, 7, 2, "#ead6c4"); rect(c, 2, 39, 3, 2, C.magicHi); rect(c, 27, 39, 3, 2, C.magicHi); }
    if (pose === "resonance") { c.strokeStyle = "#f7d2ff"; c.lineWidth = 1.5; c.beginPath(); c.arc(16, 27, 18, Math.PI * 1.12, Math.PI * 1.88); c.stroke(); c.beginPath(); c.arc(16, 27, 23, Math.PI * 1.12, Math.PI * 1.88); c.stroke(); rect(c, 14, 8, 4, 3, C.magicHi); }
    if (pose === "run1" || pose === "run2") { poly(c, [[7, 24], [2, 28], [0, 38], [6, 36], [12, 29]], C.hairMid); }
    c.restore();

    // Face highlights, warm cheeks, iris glints and visible lashes.
    rect(c, 23, 22, 5, 2, "#6e4650"); rect(c, 37, 22, 5, 2, "#6e4650");
    rect(c, 25, 24, 4, 4, C.white); rect(c, 38, 24, 4, 4, C.white);
    rect(c, 27, 25, 2, 3, "#456d91"); rect(c, 39, 25, 2, 3, "#456d91");
    rect(c, 28, 25, 1, 1, C.white); rect(c, 40, 25, 1, 1, C.white);
    rect(c, 21, 30, 4, 2, "#e9a59b"); rect(c, 42, 30, 4, 2, "#e9a59b");
    rect(c, 32, 29, 3, 4, C.skinShade); rect(c, 30, 35, 9, 2, "#a85d73"); rect(c, 32, 34, 5, 1, "#f6d8c9");
    // Shining hair strands and detailed crown jewel.
    line(c, 20, 10, 23, 33, "#644454", 1); line(c, 45, 10, 43, 35, "#644454", 1);
    rect(c, 24, 10, 4, 1, "#8b6474"); rect(c, 34, 8, 5, 1, "#8b6474"); rect(c, 44, 14, 2, 7, "#6d4b5f");
    rect(c, 29, 7, 5, 2, C.goldHi); rect(c, 31, 4, 3, 3, "#fff0ba"); rect(c, 32, 5, 2, 2, C.magic);
    // Dress embroidery, folds and gold piping.
    line(c, 24, 45, 32, 82, C.gold, 1); line(c, 40, 45, 33, 82, C.gold, 1);
    line(c, 16, 57, 12, 77, "#78a8dc", 1); line(c, 49, 57, 53, 77, "#78a8dc", 1);
    rect(c, 29, 55, 7, 3, C.goldHi); rect(c, 31, 54, 3, 5, C.gold);
    rect(c, 25, 70, 3, 2, "#f1cce4"); rect(c, 39, 73, 3, 2, "#f1cce4");
    if (pose === "cast" || pose === "victory") {
      rect(c, 48, 42, 8, 8, C.magic); rect(c, 50, 40, 4, 4, C.magicHi);
      rect(c, 52, 36, 2, 3, "#fff6ce");
    }
  }

  function replaceTexture(scene, key, width, height, painter) {
    if (scene.textures.exists(key)) scene.textures.remove(key);
    const texture = scene.textures.createCanvas(key, width, height);
    const ctx = texture.getContext(); ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height); painter(ctx); texture.refresh();
  }

  function createRemasteredCharacters(scene) {
    for (const pose of POSES) {
      replaceTexture(scene, `andres_${pose}`, 64, 96, c => drawAndres(c, pose));
      replaceTexture(scene, `vannesa_${pose}`, 64, 96, c => drawVannesa(c, pose));
    }
    // Turn the two individually authored stride poses into Phaser frame animations.
    // The rest of the pose library remains single-frame by design (jump, cast, hurt, etc.).
    if (scene.anims && typeof scene.anims.create === "function") {
      for (const role of ["andres", "vannesa"]) {
        for (const gait of ["walk", "run"]) {
          const key = `${role}-${gait}`;
          if (scene.anims.exists(key)) continue;
          const frames = gait === "walk" ? ["walk1", "walk2"] : ["run1", "run2"];
          scene.anims.create({
            key,
            frames: frames.map(pose => ({ key: `${role}_${pose}` })),
            frameRate: gait === "walk" ? 7 : 10,
            repeat: -1
          });
        }
      }
    }
    createReferenceAnimations(scene);
  }

  const REFERENCE_POSES = {
    ANDRES: { idle:[0,1], walk:[2,3], run:[4,5,6,7], jump:[6], fall:[7], land:[4], attack:[8,9], special:[8,9], resonance:[0], hurt:[10], victory:[11], cast:[9] },
    VANNESA: { idle:[0,1], walk:[2,3], run:[4,5,6,7], jump:[6], fall:[7], land:[0], attack:[8,9], special:[8,9], resonance:[8], hurt:[10], victory:[11], cast:[9] }
  };
  // Phaser 3.80.1 AnimationFrame.index is one-based (verified in a live game:
  // these frames report indices 1 and 2 for atlas frames 8 and 9). The current
  // references only provide anticipation and impact; recovery holds the last pose.
  const ACTION_TIMELINES = Object.freeze({
    ANDRES: Object.freeze({ pose: "attack", impactSequenceIndex: 2, impactTextureFrame: 9, frameRate: 12, recoveryMs: 110 }),
    VANNESA: Object.freeze({ pose: "special", impactSequenceIndex: 2, impactTextureFrame: 9, frameRate: 12, recoveryMs: 110 })
  });
  function referenceSheet(role) { return role === "VANNESA" ? "vannesaGameplaySheet" : "andresGameplaySheet"; }
  function createReferenceAnimations(scene) {
    if (!scene.anims || typeof scene.anims.create !== "function") return;
    for (const role of ["ANDRES", "VANNESA"]) {
      const sheet = referenceSheet(role);
      if (!scene.textures.exists(sheet)) continue;
      for (const [pose, frames] of Object.entries(REFERENCE_POSES[role])) {
        const key = "ref-" + role.toLowerCase() + "-" + pose;
        if (scene.anims.exists(key)) continue;
        scene.anims.create({
          key,
          frames: frames.map(frame => ({ key: sheet, frame })),
          frameRate: ACTION_TIMELINES[role].pose === pose ? ACTION_TIMELINES[role].frameRate : pose === "idle" ? 2 : pose === "walk" ? 8 : pose === "run" ? 11 : 1,
          repeat: pose === "idle" || pose === "walk" || pose === "run" ? -1 : 0
        });
      }
    }
  }

  function poseFrame(role, pose) {
    const normalized = role === "VANNESA" ? "VANNESA" : "ANDRES";
    const frames = REFERENCE_POSES[normalized][pose];
    if (!frames) return null;
    return { key: referenceSheet(normalized), frame: frames[0] };
  }
  function poseAnimation(role, pose) {
    if (!REFERENCE_POSES[role === "VANNESA" ? "VANNESA" : "ANDRES"][pose]) return null;
    return "ref-" + (role === "VANNESA" ? "vannesa" : "andres") + "-" + pose;
  }
  function actionTimeline(role) {
    const normalized = role === "VANNESA" ? "VANNESA" : "ANDRES";
    return { ...ACTION_TIMELINES[normalized], animationKey: poseAnimation(normalized, ACTION_TIMELINES[normalized].pose) };
  }

  // A second, restrained scenery pass adds architectural/organic detail to each realm.
  // It uses one graphics batch per layer to keep the number of game objects low.
  function decorateWorld(scene) {
    if (!scene || !scene.add || !scene.world || !scene.levelLength) return;
    const theme = scene.world.theme;
    const far = scene.add.graphics().setDepth(-3).setScrollFactor(0.24);
    const mid = scene.add.graphics().setDepth(0.65).setScrollFactor(0.58);
    const front = scene.add.graphics().setDepth(2.35).setScrollFactor(1);

    // Far layer: cloud-lit horizon, layered rock silhouettes and a signature sky feature.
    for (let x = 0; x < scene.levelLength + 420; x += 430) {
      const shift = Math.abs(Math.floor(x / 430)) % 3;
      far.fillStyle(scene.world.far, 0.34);
      far.fillTriangle(x - 80, 420, x + 100, 185 + shift * 22, x + 290, 420);
      far.fillStyle(0xffffff, 0.12);
      far.fillTriangle(x + 70, 260 + shift * 12, x + 100, 185 + shift * 22, x + 130, 260 + shift * 12);
      far.fillStyle(scene.world.accent, 0.12);
      far.fillCircle(x + 250, 105 + (shift * 9), 32 + shift * 4);
    }

    if (theme === "meadow") {
      far.fillStyle(0xffe4a0, 0.18); far.fillCircle(720, 132, 86);
      far.fillStyle(0xfff1c5, 0.22); far.fillCircle(720, 132, 54);
      for (let x = 300; x < scene.levelLength; x += 610) {
        mid.fillStyle(0x634e62, 0.78); mid.fillRect(x, 292, 56, 150);
        mid.fillStyle(0xb58a68, 0.86); mid.fillTriangle(x - 12, 296, x + 28, 222, x + 68, 296);
        mid.fillStyle(0xedd18e, 0.65); mid.fillRect(x + 10, 322, 8, 20); mid.fillRect(x + 38, 322, 8, 20);
        mid.fillStyle(0x382f48, 0.75); mid.fillRect(x + 23, 338, 12, 42);
        mid.lineStyle(3, 0xc6aa7b, 0.6); mid.strokeRect(x - 5, 295, 66, 144);
      }
    } else if (theme === "forest") {
      for (let x = 160; x < scene.levelLength; x += 390) {
        mid.fillStyle(0x172f31, 0.8); mid.fillRect(x, 220, 27, 235);
        mid.fillStyle(0x315f4a, 0.88); mid.fillCircle(x + 12, 220, 76); mid.fillCircle(x - 22, 255, 48); mid.fillCircle(x + 48, 260, 49);
        mid.fillStyle(0x5b9a69, 0.5); mid.fillCircle(x - 9, 205, 24); mid.fillCircle(x + 36, 208, 27);
        mid.fillStyle(0xf4df8b, 0.48); mid.fillCircle(x + 58, 328, 5); mid.fillCircle(x + 65, 338, 3);
        mid.fillStyle(0x9b6bb2, 0.7); mid.fillRect(x - 22, 430, 9, 12); mid.fillRect(x - 27, 424, 18, 7);
      }
    } else if (theme === "sea") {
      for (let x = 190; x < scene.levelLength; x += 350) {
        mid.lineStyle(7, 0x3e9aa8, 0.7); mid.beginPath(); mid.moveTo(x, 440); mid.lineTo(x + 12, 380); mid.lineTo(x - 2, 345); mid.strokePath();
        mid.lineStyle(5, 0x63c6c8, 0.7); mid.beginPath(); mid.moveTo(x + 8, 407); mid.lineTo(x + 38, 380); mid.lineTo(x + 42, 350); mid.strokePath();
        mid.fillStyle(0x8fe6e2, 0.23); mid.fillCircle(x + 88, 300, 38);
        mid.fillStyle(0x275e7c, 0.78); mid.fillRect(x + 145, 330, 14, 120); mid.fillRect(x + 195, 305, 14, 145);
        mid.fillStyle(0xbaf9f0, 0.55); mid.fillRect(x + 141, 330, 22, 5); mid.fillRect(x + 191, 305, 22, 5);
      }
    } else if (theme === "winter") {
      // Soft aurora bands across the upper skyline.
      for (let x = 0; x < scene.levelLength; x += 520) {
        mid.lineStyle(9, 0x8be3e6, 0.12); mid.beginPath(); mid.moveTo(x, 140); mid.lineTo(x + 145, 95); mid.lineTo(x + 295, 126); mid.lineTo(x + 430, 82); mid.strokePath();
        mid.lineStyle(4, 0xd4f7ff, 0.2); mid.beginPath(); mid.moveTo(x + 25, 164); mid.lineTo(x + 165, 132); mid.lineTo(x + 300, 157); mid.strokePath();
        mid.fillStyle(0xeaf8ff, 0.26); mid.fillTriangle(x + 40, 432, x + 104, 220, x + 170, 432);
        mid.fillStyle(0x709fc2, 0.36); mid.fillTriangle(x + 136, 432, x + 213, 278, x + 290, 432);
        mid.fillStyle(0xffffff, 0.52); mid.fillTriangle(x + 88, 276, x + 104, 220, x + 120, 276);
      }
    } else if (theme === "eclipse") {
      mid.fillStyle(0x100f25, 0.24); mid.fillCircle(770, 138, 94);
      mid.lineStyle(5, 0xe5b76c, 0.35); mid.strokeCircle(770, 138, 94);
      for (let x = 170; x < scene.levelLength; x += 430) {
        mid.fillStyle(0x241d3c, 0.92); mid.fillRect(x, 236, 65, 210);
        mid.fillStyle(0x49375d, 0.88); mid.fillTriangle(x - 13, 240, x + 32, 158, x + 78, 240);
        mid.fillStyle(0xe4b876, 0.35); mid.fillRect(x + 13, 281, 8, 26); mid.fillRect(x + 43, 281, 8, 26);
        mid.fillStyle(0xb87ac1, 0.4); mid.fillCircle(x + 32, 246, 11);
      }
    }

    // Foreground: short grasses, tiny flowers and paving glints. Keep platform silhouettes clear.
    for (let x = 22; x < scene.levelLength; x += 138) {
      front.lineStyle(2, theme === "winter" ? 0xd8f2ff : theme === "sea" ? 0x83d8d0 : 0x76a86b, 0.5);
      front.beginPath(); front.moveTo(x, 472); front.lineTo(x - 4, 460); front.moveTo(x + 2, 472); front.lineTo(x + 8, 457); front.strokePath();
      if (Math.floor(x / 138) % 3 === 0) {
        front.fillStyle(scene.world.accent, 0.65); front.fillCircle(x + 14, 457, 2);
        front.fillStyle(0xffffff, 0.35); front.fillCircle(x + 14, 457, 1);
      }
    }

    // Sparse animated fireflies/ice motes/bubbles. These are decorative only.
    const moteColor = theme === "sea" ? 0xa7ffff : theme === "winter" ? 0xe6f7ff : theme === "eclipse" ? 0xd9a5f3 : 0xffe4a0;
    for (let i = 0; i < 9; i++) {
      const x = 120 + i * Math.max(180, (scene.levelLength - 240) / 9);
      const y = 130 + ((i * 67) % 230);
      const mote = scene.add.circle(x, y, i % 3 === 0 ? 3 : 2, moteColor, 0.54).setDepth(4).setScrollFactor(0.72);
      scene.tweens.add({ targets: mote, y: y - 18 - (i % 3) * 5, alpha: 0.1, duration: 1300 + i * 145, delay: i * 80, yoyo: true, repeat: -1 });
    }
  }

  const originalCreate = base.create.bind(base);
  base.create = function (scene) {
    originalCreate(scene);
    try { createRemasteredCharacters(scene); }
    catch (error) { console.error("Auralia Remaster: could not replace character textures", error); }
  };

  window.AURALIA_REMASTER = { decorateWorld, frameFor: poseFrame, animationFor: poseAnimation, actionTimeline, version: "1.4.0" };
})();
