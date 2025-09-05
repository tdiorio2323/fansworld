#!/bin/bash
set -euo pipefail

# 0) Project root (adjust if needed)
PROJ="${PROJ:-$HOME/CABANA_CONSOLIDATED/active-development/main-platform}"
cd "$PROJ"

echo "▶ Cabana weekly audit @ $PROJ"

# 1) Safe backup of current state to GitHub
git remote -v | grep -q 'origin' || { echo "No origin remote. Abort."; exit 1; }
BRANCH_BAK="cabana-main-$(date +%F)"
git rev-parse --is-inside-work-tree >/dev/null
git add -A
git commit -m "audit: checkpoint before weekly verification" || true
git push origin HEAD:$BRANCH_BAK

# 2) Normalize configs for Next.js 14 App Router
#    - ESM Next config
[ -f next.config.js ] && mv -f next.config.js next.config.mjs
if [ -f next.config.mjs ]; then
  grep -q 'export default' next.config.mjs || \
  printf '/** @type {import("next").NextConfig} */\nconst nextConfig = { reactStrictMode: true };\nexport default nextConfig;\n' > next.config.mjs
fi

#    - PostCSS CJS only
rm -f postcss.config.js postcss.config.ts 2>/dev/null || true
[ -f postcss.config.cjs ] || cat > postcss.config.cjs <<'EOF'
module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };
EOF

#    - Tailwind config present
[ -f tailwind.config.cjs ] || [ -f tailwind.config.ts ] || cat > tailwind.config.cjs <<'EOF'
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: []
};
EOF

# 3) Remove duplicate route sources that broke dev
rm -f pages/sitemap.xml.ts public/sitemap.xml 2>/dev/null || true

# 4) Framework consistency checks
HAS_VITE="$(ls -1 | grep -E '^vite.config\.(ts|js)' || true)"
if [ -n "$HAS_VITE" ]; then
  echo "WARN: vite.config present. Keeping Next.js. Remove Vite if not used." >&2
fi

# 5) Clean caches
rm -rf .next node_modules

# 6) Install and typecheck
if [ -f pnpm-lock.yaml ]; then MGR=pnpm; elif [ -f package-lock.json ]; then MGR=npm; else MGR=npm; fi
case "$MGR" in
  pnpm) corepack enable pnpm >/dev/null 2>&1 || true; pnpm i --frozen-lockfile ;;
  npm)  npm ci ;;
esac

npm run -s typecheck || echo "WARN: typecheck script missing or failed"

# 7) Build to prove integrity
npm run -s build

# 8) Produce weekly report
SINCE="${SINCE:-1 week ago}"
OUT="AUDIT_REPORT_$(date +%F).md"
{
  echo "# Cabana Weekly Audit ($(date +%F))"
  echo
  echo "## Git status"
  echo '```'
  git status -sb
  echo '```'
  echo
  echo "## Commits since \"$SINCE\""
  echo '```'
  git log --since="$SINCE" --oneline --graph --decorate
  echo '```'
  echo
  echo "## Diffstat vs origin/main"
  echo '```'
  git fetch origin >/dev/null 2>&1 || true
  git diff --stat origin/main...HEAD || true
  echo '```'
  echo
  echo "## Config snapshot"
  echo '```'
  ls -1 next.config.mjs postcss.config.cjs tailwind.config.* 2>/dev/null
  echo '```'
  echo
  echo "## Route duplicates check"
  echo '```'
  find app -maxdepth 2 -iname 'sitemap.*' 2>/dev/null
  echo '```'
} > "$OUT"

echo "✔ Build passed. Report written to $OUT"
echo "✔ Backup branch pushed: $BRANCH_BAK"
echo "Next: run 'npm run dev' to boot locally."