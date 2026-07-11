const CACHE_NAME = 'adp-kai-kalender-bali-v1-7-0';
const APP_SHELL = [
  './',
  './index.html?v=170&app=kd-bali-v170',
  './manifest-v170.webmanifest?v=170',
  './data/events.2026.json',
  './data/familyMembers.sample.json',
  './data/dataCoverage.2026.json',
  './data/validationSources.json',
  './assets/icon-192-v144.png?v=170',
  './assets/icon-512-v144.png?v=170',
  './assets/favicon-48-v144.png?v=170',
  './assets/apple-touch-icon-v144.png?v=170'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return res;
    }).catch(() => caches.match(event.request))
  );
});
