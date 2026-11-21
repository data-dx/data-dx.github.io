// IRVault 使用指南（irvault/index.html）的 Tailwind 建置設定（_ 開頭資料夾，GitHub Pages 不發布）。
// 重新產生：在網站根目錄執行 sh _tools/tailwind/build.sh（commit 時 pre-commit hook 也會自動執行）
//   （等同 npx -y tailwindcss@3.4.17 -c _tools/tailwind/tailwind.config.js -i _tools/tailwind/input.css -o irvault/css/tailwind.css --minify）
// 改 irvault/index.html 用到新的 Tailwind class 後必須重跑，否則新 class 沒有樣式。
module.exports = {
  content: ["./irvault/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "Noto Sans TC", "system-ui", "sans-serif"],
      },
      // 本頁 Tailwind 顏色一律對應 irvault/css/theme.css 共用語意色，隨 App 主題切換
      colors: {
        white: "var(--c-surface)",
        slate: {
          50: "var(--c-bg)",
          100: "var(--c-border)",
          200: "var(--c-border)",
          400: "var(--c-text-3)",
          600: "var(--c-text-2)",
          700: "var(--c-text-2)",
          800: "var(--c-text)",
          900: "var(--c-text)",
        },
        blue: {
          50: "var(--c-info-soft)",
          100: "var(--c-info-soft)",
          600: "var(--c-info)",
          700: "var(--c-info)",
        },
        indigo: { 600: "var(--c-info)" },
        amber: {
          50: "var(--c-warn-soft)",
          100: "var(--c-warn-soft)",
          200: "var(--c-warn-line)",
          700: "var(--c-warn)",
          800: "var(--c-warn)",
          950: "var(--c-warn)",
        },
        emerald: { 100: "var(--c-accent-soft)", 700: "var(--c-accent)" },
        purple: { 100: "var(--c-info-soft)", 700: "var(--c-purple)" },
      },
    },
  },
};
