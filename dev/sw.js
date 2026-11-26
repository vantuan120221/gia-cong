// Chỉ giữ khung trang để mở được khi mạng chập chờn; phần mềm thật luôn tải mới từ Google.
const BAN = 'giacong-dev-1';
const KHUNG = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-180.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(BAN).then(c => c.addAll(KHUNG))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== BAN).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => {
    const sao = r.clone(); caches.open(BAN).then(c => c.put(e.request, sao)); return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
