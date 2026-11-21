#!/bin/sh
# 重新產生 irvault/css/tailwind.css（IRVault 使用指南用的 Tailwind 樣式）。
# 用法：在網站根目錄執行  sh _tools/tailwind/build.sh
# irvault/index.html 用到新的 Tailwind class 後要跑；commit 時 pre-commit hook 會自動跑。
cd "$(git rev-parse --show-toplevel)" || exit 1
npx -y tailwindcss@3.4.17 \
  -c _tools/tailwind/tailwind.config.js \
  -i _tools/tailwind/input.css \
  -o irvault/css/tailwind.css \
  --minify
