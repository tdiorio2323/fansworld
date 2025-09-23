#!/usr/bin/env bash
set -euo pipefail

// disabled path check for canonicalized location

# collect projects
mapfile -t PKGS < <(find "${SEARCH_DIRS[@]}" -maxdepth 5 -type f -name package.json 2>/dev/null | sort)

detect_fw() { grep -q '"next"' "$1" && echo next || { grep -q '"vite"' "$1" && echo vite || echo unknown; }; }
detect_pm() {
  local root="$1"
  [[ -f "$root/pnpm-lock.yaml" ]] && { echo "pnpm"; return; }
  [[ -f "$root/yarn.lock" ]] && { echo "yarn"; return; }
  [[ -f "$root/package-lock.json" ]] && { echo "npm"; return; }
  command -v pnpm >/dev/null && echo pnpm || { command -v yarn >/dev/null && echo yarn || echo npm; }
}

echo "Select project:"
i=0
for pj in "${PKGS[@]}"; do
  root="$(dirname "$pj")"; fw="$(detect_fw "$pj")"; pm="$(detect_pm "$root")"
  printf "%2d. [%s | %s] %s\n" "$((++i))" "$fw" "$pm" "$root"
done
read -rp '# ' n; idx=$((n-1))
[[ $idx -ge 0 && $idx -lt ${#PKGS[@]} ]] || { echo "invalid"; exit 1; }

root="$(dirname "${PKGS[$idx]}")"
fw="$(detect_fw "${PKGS[$idx]}")"
pm="$(detect_pm "$root")"

# ports
base_next=3000; base_vite=5173
port_offset=$(( (RANDOM % 400) + 1 ))
port_next=$((base_next + port_offset))
port_vite=$((base_vite + port_offset))

install() {
  case "$pm" in
    pnpm) (cd "$root" && pnpm install) ;;
    yarn) (cd "$root" && yarn install) ;;
    npm)  (cd "$root" && npm install) ;;
  esac
}
run() {
  case "$fw" in
    next)
      case "$pm" in
        pnpm) (cd "$root" && pnpm dev -p "$port_next") ;;
        yarn) (cd "$root" && yarn dev -p "$port_next") ;;
        npm)  (cd "$root" && npm run dev -- -p "$port_next") ;;
      esac
      ;;
    vite)
      case "$pm" in
        pnpm) (cd "$root" && pnpm dev -- --port "$port_vite") ;;
        yarn) (cd "$root" && yarn dev --port "$port_vite") ;;
        npm)  (cd "$root" && npm run dev -- --port "$port_vite") ;;
      esac
      ;;
    *)
      echo "Unknown framework. Open manually: cd \"$root\" && $pm install && $pm run dev"; exit 0;;
  esac
}

url="http://localhost:$([ "$fw" = next ] && echo "$port_next" || echo "$port_vite")"

# launch in new Terminal tab and open browser (macOS)
if command -v osascript >/dev/null; then
  cmd="cd \"$root\"; $pm install; "
  if [ "$fw" = next ]; then
    cmd+="$pm run dev -p $port_next"
  else
    [ "$pm" = npm ] && cmd+="npm run dev -- --port $port_vite" || cmd+="$pm run dev -- --port $port_vite"
  fi
  osascript <<EOF >/dev/null
tell application "Terminal"
  activate
  do script "$cmd"
end tell
EOF
  open "$url" >/dev/null 2>&1 || true
  echo "Launching → $url"
else
  install
  run &
  sleep 2
  open "$url" >/dev/null 2>&1 || xdg-open "$url" >/dev/null 2>&1 || true
  echo "Launching → $url"
fi