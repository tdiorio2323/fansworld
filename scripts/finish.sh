#!/usr/bin/env bash
set -euo pipefail

# Inputs (override via env): DESIGN_SPEC=docs/design.md BASE_URL=https://cabanagrp.com
DESIGN_SPEC="${DESIGN_SPEC:-docs/design.md}"
BASE_URL="${BASE_URL:-https://cabanagrp.com}"

echo "=== CABANA FINISHER ==="

# 0) Guardrails
command -v jq >/dev/null || (echo "Install jq"; exit 1)
command -v rg >/dev/null || (echo "Install ripgrep (rg)"; exit 1)
command -v node >/dev/null || (echo "Install Node"; exit 1)
command -v npx  >/dev/null || (echo "Install npm/npx"; exit 1)

# 1) Kill static shadows (SPA owns routes)
find public -maxdepth 2 -name "*.html" \
  ! -name "index.html" ! -name "404.html" \
  ! -name "robots.txt" ! -name "sitemap.xml" \
  -print -delete || true

# 2) Enforce rewrites (Vercel)
cat > vercel.json <<'JSON'
{
  "version": 2,
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
JSON

# 3) Build clean
npm ci
npm run build

# 4) Preview & wait
(npm run preview >/dev/null 2>&1 &) ; npx wait-on http://localhost:4173

# 5) Route audit
node scripts/list-routes.mjs | tee reports/routes.txt
chmod +x scripts/check-routes.sh
BASE="http://localhost:4173" BASE_URL="$BASE" scripts/check-routes.sh | tee reports/route-check.txt

# 6) SEO pack (robots/sitemap if missing)
[ -f public/robots.txt ] || cat > public/robots.txt <<EOF
User-agent: *
Allow: /
Sitemap: ${BASE_URL%/}/sitemap.xml
EOF

[ -f public/sitemap.xml ] || {
  echo "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">" > public/sitemap.xml
  awk '{print $NF}' reports/routes.txt | sed 's#^\*$##' | sed 's#^$#/#' | sort -u | while read -r p; do
    [ -z "$p" ] && continue
    echo "  <url><loc>${BASE_URL%/}${p}</loc></url>" >> public/sitemap.xml
  done
  echo "</urlset>" >> public/sitemap.xml
}

# 7) Lighthouse (via lhci)
cat > lighthouserc.json <<'JSON'
{
  "ci": {
    "collect": { "url": ["http://localhost:4173/", "http://localhost:4173/about", "http://localhost:4173/pricing"], "numberOfRuns": 1 },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", {"minScore": 0.85}],
        "categories:seo": ["error", {"minScore": 0.95}],
        "categories:best-practices": ["error", {"minScore": 0.95}],
        "categories:accessibility": ["warn", {"minScore": 0.90}]
      }
    }
  }
}
JSON
npx @lhci/cli@0.13.0 autorun --config=lighthouserc.json || true

# 8) Quick prod sanity (200s)
echo "=== PROD SANITY ===" | tee reports/prod-check.txt
for p in / /about /pricing /features /help /terms /signin /register /discover /feed /creator-dashboard /billing /settings; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL%/}$p")
  echo "$code  $p" | tee -a reports/prod-check.txt
done

echo "=== DONE. Reports in ./reports ==="