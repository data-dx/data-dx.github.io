#!/bin/sh
# git pre-commit hook：commit 內有 irvault/index.html 時，自動重新產生 irvault/css/tailwind.css 並一起加入 commit。
# 安裝（每台電腦一次，在網站根目錄的 Git Bash 執行）：
#   printf '#!/bin/sh\nexec sh _tools/tailwind/pre-commit.sh\n' > .git/hooks/pre-commit
cd "$(git rev-parse --show-toplevel)" || exit 1

if ! git diff --cached --name-only | grep -qx "irvault/index.html"; then
  exit 0
fi

echo "[pre-commit] irvault/index.html 有變更，重新產生 irvault/css/tailwind.css ..."
if ! sh _tools/tailwind/build.sh >/dev/null 2>&1; then
  echo "[pre-commit] ❌ Tailwind 編譯失敗（需要網路與 Node.js）。請手動執行 sh _tools/tailwind/build.sh 後再 commit。"
  exit 1
fi

if ! git diff --quiet -- irvault/css/tailwind.css || ! git ls-files --error-unmatch irvault/css/tailwind.css >/dev/null 2>&1; then
  git add irvault/css/tailwind.css
  echo "[pre-commit] ✅ tailwind.css 已更新並自動加入這次 commit。"
else
  echo "[pre-commit] tailwind.css 不需更新。"
fi
exit 0
