#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://localhost:4173}"   # default 4173
LIST="reports/routes.txt"

# wait for server (max ~10s)
for i in {1..20}; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE/")
  [[ "$code" =~ ^20[04]$ ]] && break || sleep 0.5
done

while IFS= read -r r; do
  [[ -z "$r" ]] && continue
  code=$(curl -s -o /dev/null -w "%{http_code}" "$BASE$r")
  [[ "$code" =~ ^20[04]$ ]] && echo "✅ $code  $r" || echo "❌ $code  $r"
done < "$LIST"
