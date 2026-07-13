const CACHE_NAME = 'adp-kai-kalender-bali-v2-6-1';
const APP_SHELL = [
  './',
  './index.html?v=261&app=kd-bali-v261',
  './manifest-v261.webmanifest?v=261',
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
  './data/syncConfidence.schema.json',
  './data/cloudSyncHardening.schema.json',
  './data/autoBackupReminder.schema.json',
  './assets/icon-192-v144.png?v=261',
  './assets/icon-512-v144.png?v=261',
  './assets/favicon-48-v144.png?v=261',
  './assets/apple-touch-icon-v144.png?v=261'
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
  if (url.searchParams.get('v') === '261' || event.request.mode === 'navigate') {
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
