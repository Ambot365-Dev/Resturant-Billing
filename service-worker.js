const CACHE_NAME = 'restaurant-pos-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/admin.html',
  '/analytics.html',
  '/settings.html',
  '/login.html',
  '/invoice.html',
  '/css/styles.css',
  '/js/storage.js',
  '/js/app.js',
  '/js/pos.js',
  '/js/admin.js',
  '/js/analytics.js',
  '/js/settings.js',
  '/js/invoice.js',
  '/js/whatsapp-report.js'
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

