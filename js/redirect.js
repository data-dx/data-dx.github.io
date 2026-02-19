(function () {
  try {
    /* ===== 開發 / 預覽環境：完全不 redirect ===== */
    var isDev =
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1' ||
      location.port === '5500';

    if (isDev) {
      // console.log('[redirect.js] dev mode, skip redirect');
      return;
    }

    /* ===== 以下是你原本的邏輯（未改） ===== */

    // 只在「直接開啟此頁」才跳轉；若被 index/iframe 包住，就不要跳
    if (window.top !== window.self) return;

    // 若本來就在 index.html，就不要再跳，避免迴圈
    var curUrl = new URL(window.location.href);
    if (curUrl.pathname.toLowerCase().endsWith("/index.html")) return;

    // 透過目前載入的 redirect.js 推算 root
    var sc = document.currentScript;
    if (!sc || !sc.src) return;

    var scriptUrl = new URL(sc.src);

    // scriptUrl = {root}/js/redirect.js
    // rootUrl = {root}/
    var rootUrl = new URL("../", scriptUrl);

    // 計算目前頁面相對於 root 的路徑
    var rootPath = rootUrl.pathname;
    var curPath = curUrl.pathname;

    var relPath = curPath;
    if (curPath.toLowerCase().startsWith(rootPath.toLowerCase())) {
      relPath = curPath.substring(rootPath.length);
    } else if (relPath.startsWith("/")) {
      relPath = relPath.substring(1);
    }

    // 組 index.html?page=...
    var target = new URL("index.html", rootUrl);
    target.searchParams.set("page", relPath);

    window.location.replace(target.toString());
  } catch (e) {
    // 靜默失敗
  }
})();
