/* redirect.js
   功能：
   - 如果使用者「直接開啟」某個 sample 子頁（window.top === window.self）
     就自動導回站台根目錄的 index.html
   - 並把目前頁面的相對路徑帶給 index： ?page=sample/TW/TRAN/TW-TRAN_42704065.html

   這版不依賴寫死 ../../../index.html
   而是從本 script 的載入位置推算站台根目錄（最穩）
*/

(function () {
  try {
    // 只在「直接開啟此頁」才跳轉；若被 index/iframe 包住，就不要跳
    if (window.top !== window.self) return;

    // 若本來就在 index.html，就不要再跳，避免迴圈
    var curUrl = new URL(window.location.href);
    if (curUrl.pathname.toLowerCase().endsWith("/index.html")) return;

    // 透過目前載入的 redirect.js 推算 root
    // currentScript.src 會是 .../js/redirect.js
    var sc = document.currentScript;
    if (!sc || !sc.src) return;

    var scriptUrl = new URL(sc.src);

    // scriptUrl = {root}/js/redirect.js
    // rootUrl = {root}/
    var rootUrl = new URL("../", scriptUrl); // -> .../ (因為 scriptUrl 在 /js/ 下)

    // 計算目前頁面相對於 root 的路徑
    // e.g. /sample/TW/TRAN/TW-TRAN_42704065.html
    var rootPath = rootUrl.pathname; // ends with /
    var curPath = curUrl.pathname;

    // 若 rootPath 不是 curPath 的前綴，仍嘗試用最簡單的方式帶完整路徑
    var relPath = curPath;
    if (curPath.toLowerCase().startsWith(rootPath.toLowerCase())) {
      relPath = curPath.substring(rootPath.length);
    } else if (relPath.startsWith("/")) {
      relPath = relPath.substring(1);
    }

    // 組 index.html?page=...
    var target = new URL("index.html", rootUrl);
    target.searchParams.set("page", relPath);

    // 用 replace 避免使用者返回時又回到被導頁的那一頁
    window.location.replace(target.toString());
  } catch (e) {
    // 靜默失敗，不要影響頁面本身預覽
    // console.error(e);
  }
})();
