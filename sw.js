const CACHE_NAME = 'punkte-zaehler-cache-v1';
const urlsToCache = [
  './',
  './punktezähler.html',
  './manifest.json',
  './icon-192.png'
];

// Installieren des Service Workers und Cachen der Dateien
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Abfangen der Fetch-Anfragen (Network-First-Strategie mit Fallback auf Cache)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache-Treffer: gebe die gecachte Version zurück
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

// Aktivieren des Service Workers und Bereinigen alter Caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
