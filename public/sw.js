/*
 * RestoReserve service worker.
 * Kept hand-written because Analog's multi-pass Vite build skips
 * vite-plugin-pwa's Workbox generation step (the plugin still emits the
 * manifest and the /sw.js registration script, which point here).
 *
 * Policy:
 *  - /api/ requests are never cached — reservations and orders must stay live.
 *  - Same-origin static assets use stale-while-revalidate.
 */
const CACHE_NAME = 'restoreserve-static-v1';
const STATIC_DESTINATIONS = ['style', 'script', 'image', 'font'];

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return; // always network

  if (STATIC_DESTINATIONS.includes(request.destination)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
  }
});
