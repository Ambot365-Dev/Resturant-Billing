const CACHE_NAME = 'restaurant-pos-v1';
// Get base path for GitHub Pages
const basePath = self.location.pathname.split('/').slice(0, -1).join('/') || '';
const urlsToCache = [
  basePath + '/',
  basePath + '/index.html',
  basePath + '/admin.html',
  basePath + '/analytics.html',
  basePath + '/settings.html',
  basePath + '/login.html',
  basePath + '/invoice.html',
  basePath + '/cart.html',
  basePath + '/css/styles.css',
  basePath + '/js/storage.js',
  basePath + '/js/app.js',
  basePath + '/js/pos.js',
  basePath + '/js/admin.js',
  basePath + '/js/analytics.js',
  basePath + '/js/settings.js',
  basePath + '/js/invoice.js',
  basePath + '/js/cart.js',
  basePath + '/js/whatsapp-report.js'
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

