(() => {
  "use strict";
  const status = document.getElementById("connection-status");
  const controls = document.querySelectorAll("#touch-controls button");
  const clearPressed = () => {
    controls.forEach(button => {
      button.dataset.pressed = "false";
      button.classList.remove("is-pressed");
    });
    const virtualKeys = window.LOVE_GAME_TOUCH;
    if (virtualKeys) Object.keys(virtualKeys).forEach(key => { virtualKeys[key] = false; });
  };
  const paintNetwork = () => {
    if (!status) return;
    status.hidden = navigator.onLine;
  };

  // Do not leave a virtual key pressed if the browser loses focus or the app is backgrounded.
  window.addEventListener("blur", clearPressed);
  window.addEventListener("pagehide", clearPressed);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearPressed();
  });
  window.addEventListener("online", paintNetwork);
  window.addEventListener("offline", paintNetwork);
  paintNetwork();

  controls.forEach(button => {
    button.addEventListener("contextmenu", event => event.preventDefault());
    button.addEventListener("dragstart", event => event.preventDefault());
    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      button.dataset.pressed = "true";
      button.classList.add("is-pressed");
      try { button.setPointerCapture(event.pointerId); } catch (_) {}
    });
    const release = event => {
      if (event) event.preventDefault();
      button.dataset.pressed = "false";
      button.classList.remove("is-pressed");
    };
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
  });

  // Gesture suppression is limited to the game shell so ordinary browser UI remains usable.
  const shell = document.getElementById("game-shell");
  shell?.addEventListener("contextmenu", event => event.preventDefault());
  shell?.addEventListener("dragstart", event => event.preventDefault());

  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js", { scope: "./" })
        .then(registration => registration.update().catch(() => {}))
        .catch(error => console.warn("No se pudo activar el modo de caché:", error));
    }, { once: true });
  }
})();
