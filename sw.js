/* THE KINGDOM OF LOVE — PWA cache. Bump CACHE_VERSION when shipping a new release. */
const CACHE_VERSION = "kol-v5-20261124-1";
const CORE_CACHE = `${CACHE_VERSION}-core`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const CORE_FILES = [
  "./", "./index.html", "./style.css", "./manifest.webmanifest",
  "./src/config.js", "./src/data.js", "./src/art.js", "./src/game.js", "./src/pwa.js",
  "./assets/concept/title-screen-concept.webp", "./assets/worlds/valle-de-las-campanas.webp", "./assets/share/og-cover.jpg",
  "./assets/icons/icon-192.png", "./assets/icons/icon-512.png", "./assets/icons/apple-touch-icon.png"
];
const PHASER_URL = "https://cdn.jsdelivr.net/npm/phaser@3.80.1/dist/phaser.min.js";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CORE_CACHE);
    await cache.addAll(CORE_FILES);
    // Warm the pinned Phaser engine while online. Opaque no-cors responses can be cached.
    try {
      const runtime = await caches.open(RUNTIME_CACHE);
      for (const engineUrl of [PHASER_URL, "https://unpkg.com/phaser@3.80.1/dist/phaser.min.js"]) {
        const request = new Request(engineUrl, { mode: "no-cors", credentials: "omit" });
        try {
          const response = await Promise.race([
            fetch(request),
            new Promise((_, reject) => setTimeout(() => reject(new Error("Phaser warm-cache timeout")), 9000))
          ]);
          if (response && (response.ok || response.type === "opaque")) { await runtime.put(request, response); break; }
        } catch (_) { /* try the next pinned CDN */ }
      }
    } catch (_) {
      // The game still works online; offline engine availability is best-effort.
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith("kol-") && key !== CORE_CACHE && key !== RUNTIME_CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin && ["cdn.jsdelivr.net", "unpkg.com"].includes(url.hostname) && url.pathname.includes("phaser@3.80.1")) {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.type === "opaque")) await cache.put(request, response.clone());
        return response;
      } catch (error) {
        const cached = await cache.match(request) || await cache.match(PHASER_URL);
        if (cached) return cached;
        throw error;
      }
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        const cache = await caches.open(CORE_CACHE);
        cache.put("./index.html", response.clone()).catch(() => {});
        return response;
      } catch (_) {
        return (await caches.match("./index.html")) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone()).catch(() => {});
    }
    return response;
  })());
});
