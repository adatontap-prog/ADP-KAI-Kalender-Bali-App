const CACHE_NAME = 'adp-kai-kalender-bali-v2-5-5';
const APP_SHELL = [
  './',
  './index.html?v=258&app=kd-bali-v258',
  './manifest-v258.webmanifest?v=258',
  './data/events.2026.json',
  './data/familyMembers.sample.json',
  './data/dataCoverage.2026.json',
  './data/validationSources.json',
  './data/firebaseSync.schema.json',
  './data/bantenChecklist.schema.json',
  './data/ceremonyArchive.schema.json',
  './data/firebaseSetup.schema.json',
  './data/firebaseAuthPilot.schema.json',
  './data/firestoreSeedSync.schema.json',
  './data/firestoreRestoreReview.schema.json',
  './data/firestoreSyncLog.schema.json',
  './data/deviceTransferTest.schema.json',
  './assets/icon-192-v144.png?v=258',
  './assets/icon-512-v144.png?v=258',
  './assets/favicon-48-v144.png?v=258',
  './assets/apple-touch-icon-v144.png?v=258'
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
  const url = new URL(event.request.url);
  if (url.searchParams.get('v') === '258' || event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return res;
    }).catch(() => caches.match(event.request)));
    return;
  }
  event.respondWith(fetch(event.request).then(res => {
    const copy = res.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return res;
  }).catch(() => caches.match(event.request)));
});
