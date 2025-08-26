#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-${BASE_URL:-http://localhost:4173}}"
while IFS= read -r r; do
  [[ -z "$r" || "$r" == "*" ]] && continue
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$r")
  [[ "$code" =~ ^20[04]$ ]] && echo "✅ $code  $r" || echo "❌ $code  $r"
done < reports/routes.txt