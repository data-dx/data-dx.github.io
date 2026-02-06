// 基礎 Service Worker，確保 PWA 可被安裝
self.addEventListener('fetch', (event) => {
  // 這裡可以加入快取邏輯，目前保持空以確保每次都抓最新版
  event.respondWith(fetch(event.request));
});
