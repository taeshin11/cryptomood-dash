// Service Worker for CryptoMood Dash PWA
const CACHE_NAME = 'cryptomood-v2';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/i18n.js',
    '/js/gauge.js',
    '/js/coins.js',
    '/js/counter.js',
    '/js/sheets.js',
    '/js/feedback.js',
    '/js/app.js',
    '/manifest.json'
];

// Install: cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: network-first for API, cache-first for static
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // API calls: network only (always fresh data)
    if (url.hostname === 'api.alternative.me' || url.hostname === 'api.coingecko.com') {
        event.respondWith(fetch(event.request));
        return;
    }

    // Static assets: stale-while-revalidate
    event.respondWith(
        caches.match(event.request).then((cached) => {
            const fetched = fetch(event.request).then((response) => {
                if (response && response.status === 200) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            }).catch(() => cached);
            return cached || fetched;
        })
    );
});
