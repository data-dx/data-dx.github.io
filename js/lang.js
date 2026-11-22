// 全站語言（首頁、/irvault/、about.html 共用；之後有英文版的頁面也用這支）
// 規則：使用者自己選過的語言優先（存在 localStorage "ir-lang"，各頁共用）；
//       沒選過就看瀏覽器語系：繁體中文（zh 開頭，且不是簡體 Hans／中國 CN／新加坡 SG）→ 繁中，其他一律英文。
//       還沒有英文版的頁面就顯示繁中。
// 切換：頂部列右上角的語言按鈕（地球圖示＋目前語言，例如「繁中」「EN」），點開選 English／繁體中文。
//       選項加 data-set-lang="en" 或 data-set-lang="zh-TW"，點了就記住並重新整理；目前語言那一項右邊打勾。
//       按鈕上的目前語言文字放在 data-lang-label 元素裡，由本程式填入。
var IR_LANG_KEY = "ir-lang";

function irLang() {
  try {
    var saved = localStorage.getItem(IR_LANG_KEY);
    if (saved === "en" || saved === "zh-TW") return saved;
  } catch (e) {}
  var raw = (navigator.language || navigator.userLanguage || "").toLowerCase();
  return raw.indexOf("zh") === 0 && !/hans|-cn|-sg/.test(raw) ? "zh-TW" : "en";
}

function irSetLang(lang) {
  try {
    localStorage.setItem(IR_LANG_KEY, lang);
  } catch (e) {}
  location.reload();
}

(function () {
  // 語言選項的共用樣式：目前語言粗體、右邊打勾；按鈕上的地球圖示
  var css =
    "[data-set-lang]{display:flex!important;align-items:center;justify-content:space-between;gap:1.25rem}" +
    "[data-set-lang].ir-lang-current{font-weight:700}" +
    "[data-set-lang].ir-lang-current::after{content:'✓';font-weight:700}" +
    ".ir-lang-btn svg{width:1.05em;height:1.05em;flex:0 0 auto}" +
    ".ir-lang-btn{display:inline-flex!important;align-items:center;gap:.35rem;white-space:nowrap}";
  var style = document.createElement("style");
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  function markCurrent() {
    var cur = irLang();
    document.querySelectorAll("[data-lang-label]").forEach(function (el) {
      el.textContent = cur === "en" ? "EN" : "繁中";
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (el) {
      var on = el.getAttribute("data-set-lang") === cur;
      el.classList.toggle("ir-lang-current", on);
      if (on) el.setAttribute("aria-current", "true");
    });
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest && e.target.closest("[data-set-lang]");
    if (!el) return;
    e.preventDefault();
    var lang = el.getAttribute("data-set-lang");
    if (lang !== irLang()) irSetLang(lang);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", markCurrent);
  else markCurrent();
})();
