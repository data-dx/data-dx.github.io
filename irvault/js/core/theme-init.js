/* ============================================================================
   專案名稱: IRVault - 介面主題初始化 (theme-init.js)
   功能範疇: 跟隨系統 / 深色 / 一般 三種主題；於 CSS 載入前設定 <html data-theme>，防止開頁先閃黑再轉白
   使用方式: 各頁 <head> 最前面以同步 <script> 載入 (須早於 css/theme.css 生效前)
   儲存鍵值: localStorage "irvault_theme" = "system" | "dark" | "light" (預設 "system" 跟隨手機系統)
   對外介面: window.applyIrvaultTheme(pref)、window.getIrvaultThemePreference()
             主題實際切換時於 document 觸發 "irvault:themeChanged" 事件 (detail.theme = "dark" | "light")
   ============================================================================ */
(function initTheme() {
  const media = (typeof window.matchMedia === "function") ? window.matchMedia("(prefers-color-scheme: light)") : null;
  const readPref = () => {
    try {
      const v = localStorage.getItem("irvault_theme");
      return (v === "dark" || v === "light") ? v : "system";
    } catch (_) {
      return "system";
    }
  };
  const applyTheme = (pref) => {
    const p = (pref === "dark" || pref === "light") ? pref : "system";
    const resolved = p === "system" ? ((media && media.matches) ? "light" : "dark") : p;
    const prev = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", resolved);
    if (prev && prev !== resolved) {
      try { document.dispatchEvent(new CustomEvent("irvault:themeChanged", { detail: { theme: resolved } })); } catch (_) {}
    }
    return resolved;
  };
  window.applyIrvaultTheme = applyTheme;
  window.getIrvaultThemePreference = readPref;
  applyTheme(readPref());
  // 跟隨系統模式下，手機切換深/淺色時即時同步
  if (media) {
    const onSystemChange = () => { if (readPref() === "system") applyTheme("system"); };
    if (typeof media.addEventListener === "function") media.addEventListener("change", onSystemChange);
    else if (typeof media.addListener === "function") media.addListener(onSystemChange);
  }
  // 其他分頁於設定頁變更主題時同步
  window.addEventListener("storage", (e) => { if (e.key === "irvault_theme") applyTheme(readPref()); });
})();
