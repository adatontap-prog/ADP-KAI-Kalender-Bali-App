const CACHE_NAME = 'adp-kai-kalender-bali-v2-2-0';
const APP_SHELL = [
  './',
  './index.html?v=220&app=kd-bali-v220',
  './manifest-v220.webmanifest?v=220',
  './data/events.2026.json',
  './data/familyMembers.sample.json',
  './data/dataCoverage.2026.json',
  './data/validationSources.json',
  './assets/icon-192-v144.png?v=220',
  './assets/icon-512-v144.png?v=220',
  './assets/favicon-48-v144.png?v=220',
  './assets/apple-touch-icon-v144.png?v=220'
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
