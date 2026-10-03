const VERSION = "melody-static-v2";
const SHELL_CACHE = `${VERSION}-shell`;
const RUNTIME_CACHE = `${VERSION}-runtime`;
const BASE_PATH = new URL(".", self.registration.scope).pathname.replace(/\/$/, "");
const asset = (path) => `${BASE_PATH}${path}` || "/";
const PRECACHE = [
  asset("/"),
  asset("/offline.html"),
  asset("/manifest.webmanifest"),
  asset("/icons/icon-192.png"),
  asset("/icons/icon-512.png"),
  asset("/images/hero-melody.jpg"),
  asset("/images/cover-good-days.jpg"),
  asset("/images/cover-lofi.jpg"),
  asset("/audio/preview-30.mp3"),
  asset("/audio/preview-15.mp3"),
  asset("/audio/preview-12.mp3")
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== SHELL_CACHE && key !== RUNTIME_CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) { caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response.clone())); }
      return response;
    }).catch(async () => (await caches.match(request)) || (await caches.match(asset("/offline.html")))));
    return;
  }

  event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
    if (response.ok) {
      const path = url.pathname;
      if (path.startsWith(`${BASE_PATH}/_next/static/`) || path.startsWith(`${BASE_PATH}/images/`) || path.startsWith(`${BASE_PATH}/icons/`) || path.startsWith(`${BASE_PATH}/audio/`)) {
        caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, response.clone()));
      }
    }
    return response;
  })));
});
