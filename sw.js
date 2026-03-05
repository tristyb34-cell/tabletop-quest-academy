/* Service Worker for Tabletop Quest Academy */
const CACHE_VERSION = 'tqa-v2';
const SHELL_CACHE = CACHE_VERSION + '-shell';
const CONTENT_CACHE = CACHE_VERSION + '-content';

const SHELL_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './favicon.svg',
  './manifest.webmanifest',
];

// Install: pre-cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL_FILES))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== SHELL_CACHE && k !== CONTENT_CACHE).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Fetch: route to appropriate strategy
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET and cross-origin (Firebase, Google Fonts CDN is ok to cache)
  if (event.request.method !== 'GET') return;
  if (url.origin !== self.location.origin && !url.hostname.includes('fonts.googleapis.com') && !url.hostname.includes('fonts.gstatic.com')) return;

  // Google Fonts: cache-first
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirst(event.request, SHELL_CACHE));
    return;
  }

  // App shell files: cache-first
  const isShellFile = SHELL_FILES.some(f => url.pathname.endsWith(f.replace('./', '/')) || url.pathname === '/');
  if (isShellFile) {
    event.respondWith(cacheFirst(event.request, SHELL_CACHE));
    return;
  }

  // Content files (.md, .json): network-first with cache fallback
  if (url.pathname.endsWith('.md') || url.pathname.endsWith('.json')) {
    event.respondWith(networkFirst(event.request, CONTENT_CACHE));
    return;
  }

  // Everything else: network-first
  event.respondWith(networkFirst(event.request, CONTENT_CACHE));
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503 });
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}
