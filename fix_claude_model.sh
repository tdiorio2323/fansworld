#!/usr/bin/env bash
set -euo pipefail
TARGET="claude-3-5-sonnet-20241022"
BAD=("claude-sonnet-4" "claude-4" "claude-4-sonnet" "claude-4.1" "claude-sonnet-4.1")

# files to scan
readarray -t FILES < <(git ls-files 2>/dev/null | grep -E '\.(ts|tsx|js|jsx|mjs|cjs|json)$' || true)
[ ${#FILES[@]} -eq 0 ] && readarray -t FILES < <(find . -type f -regex '.*\.\(ts\|tsx\|js\|jsx\|mjs\|cjs\|json\)$')

# replace bad model strings
for b in "${BAD[@]}"; do
  grep -Ilr --exclude-dir=node_modules --exclude-dir=.git "$b" "${FILES[@]}" 2>/dev/null | while read -r f; do
    sed -i'' -e "s/$b/$TARGET/g" "$f"
    echo "fixed: $f"
  done
done

# ensure .env has ANTHROPIC_API_KEY
[ -f .env ] || touch .env
grep -q '^ANTHROPIC_API_KEY=' .env || echo "ANTHROPIC_API_KEY=" >> .env
echo "done."
