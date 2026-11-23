const CACHE_NAME = 'walnut-v11';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/brand/WM_fevicon.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
      .then(() => self.clients.claim())
      // Navigation preload: the browser starts fetching the page in parallel
      // with this worker booting, instead of waiting for us (~1s saved on
      // repeat visits where the worker is already installed).
      .then(() => self.registration.navigationPreload?.enable())
  );
});

// Network-first with cache fallback: always show the newest copy when online,
// keep a copy for offline. Only hashed bundle filenames are safe to serve
// cache-first, because their URL changes on every deploy.
const networkFirst = (request, cacheName = CACHE_NAME) =>
  fetch(request)
    .then((response) => {
      if (response && response.status === 200 && response.type === 'basic') {
        const copy = response.clone();
        caches.open(cacheName).then((cache) => cache.put(request, copy));
      }
      return response;
    })
    .catch(() => caches.match(request).then((cached) => cached || Response.error()));

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Hashed build output — URL changes per deploy, so cache-first is safe.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
    return;
  }

  // Pages: use the browser's preloaded response when it has one (it started
  // before this worker finished booting), otherwise network-first so a new
  // deploy is picked up immediately; cached copy only as offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          return (await event.preloadResponse) || (await fetch(request));
        } catch {
          return (await caches.match('/index.html')) || Response.error();
        }
      })()
    );
    return;
  }

  // Images (incl. responsive variants), fonts, JSON data: network-first so an
  // updated file shows on the very next reload instead of a stale cached one.
  event.respondWith(networkFirst(request));
});
