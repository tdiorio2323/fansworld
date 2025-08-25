#!/bin/bash
set -euo pipefail

# ==== CONFIG: KEEP ONLY THESE ====
KEEP_MAIN="/Users/tylerdiorio/fansworld"
KEEP_GOLD="/Users/tylerdiorio/Cabana_GOLD_20250813_143315"

# Extra keepers (edit if needed)
KEEP_EXTRA=(
  "$KEEP_MAIN/create-cabana-gold-snapshot.sh"
  "$KEEP_MAIN/CLAUDE.md"
  "$KEEP_MAIN/.env.example"
  "$KEEP_MAIN/legal"
  "$KEEP_MAIN/README.md"
)

# Patterns to quarantine (adjust if you see other clones/copies)
MATCH_DIR_NAMES=(
  "fansworld*"
  "cabana*"
  "Cabana_*"
  "Cabana_backup_*"
  "fansworld_old*"
  "creator-projects-backup-*"
  "fansworld-luxe-starter*"
  "fansworld-lux-starter*"    # Added: typo variant
  "cabana-platform*"
  "td-studios-creator-management*"  # Added: related project
)

# ==== PREP ====
TS="$(date +"%Y%m%d_%H%M%S")"
QUARANTINE="$HOME/CABANA_QUARANTINE_$TS"
ARCHIVE_DIR="$HOME/CABANA_ARCHIVE_$TS"
ZIP_OUT="$HOME/Cabana_GOLD_$TS.zip"

mkdir -p "$QUARANTINE" "$ARCHIVE_DIR"

echo "=== CABANA DIRECTORY CLEANUP SCRIPT ==="
echo "Timestamp: $TS"
echo

echo "== 1) Verifying keep paths =="
for p in "$KEEP_MAIN" "$KEEP_GOLD"; do
  if [[ -d "$p" ]]; then
    echo "✅ Found: $p"
  else
    echo "❌ MISSING: $p"
    exit 1
  fi
done
echo "✅ All required paths verified."
echo

echo "== 2) Creating Drive-ready ZIP of GOLD snapshot =="
(cd "$(dirname "$KEEP_GOLD")" && zip -qry "$ZIP_OUT" "$(basename "$KEEP_GOLD")")
ZIP_SIZE=$(du -h "$ZIP_OUT" | cut -f1)
echo "✅ ZIP created: $ZIP_OUT ($ZIP_SIZE)"
echo

echo "== 3) DRY-RUN: Scanning for directories to quarantine =="
FOUND=()
SEARCH_PATHS=("$HOME" "$HOME/Desktop" "$HOME/Documents" "$HOME/Downloads")

for search_path in "${SEARCH_PATHS[@]}"; do
  [[ ! -d "$search_path" ]] && continue
  echo "Scanning: $search_path"
  
  for pat in "${MATCH_DIR_NAMES[@]}"; do
    while IFS= read -r -d '' hit; do
      # Skip keep paths
      if [[ "$hit" == "$KEEP_MAIN" || "$hit" == "$KEEP_GOLD" ]]; then
        echo "  ↳ Skipping (keeper): $(basename "$hit")"
        continue
      fi
      
      SKIP=0
      for k in "${KEEP_EXTRA[@]}"; do
        [[ "$hit" == "$k" ]] && SKIP=1 && break
      done
      [[ $SKIP -eq 1 ]] && continue

      FOUND+=("$hit")
      echo "  ↳ Found: $hit"
    done < <(find "$search_path" -maxdepth 2 -type d -iname "$pat" -print0 2>/dev/null || true)
  done
done

echo
if [[ ${#FOUND[@]} -eq 0 ]]; then
  echo "🎉 Nothing else matched. You're already clean!"
else
  printf "⚠️  Will quarantine the following %d paths:\n" "${#FOUND[@]}"
  for f in "${FOUND[@]}"; do 
    size=$(du -sh "$f" 2>/dev/null | cut -f1 || echo "?")
    echo "  📁 $f ($size)"
  done

  echo
  echo "⚠️  These will be MOVED (not deleted) to quarantine folder."
  echo "⚠️  You can restore them later if needed."
  echo
  read -r -p "Type EXACTLY 'I UNDERSTAND' to proceed: " CONF
  if [[ "$CONF" == "I UNDERSTAND" ]]; then
    echo
    echo "== 4) Quarantining directories =="
    for f in "${FOUND[@]}"; do
      base="$(basename "$f")"
      # Handle duplicates by adding timestamp
      target="$QUARANTINE/$base"
      if [[ -e "$target" ]]; then
        target="$QUARANTINE/${base}_$(date +%s)"
      fi
      
      echo "  📦 Moving: $(basename "$f") → quarantine"
      mv "$f" "$target" 2>/dev/null || {
        echo "  ❌ Failed to move: $f"
        continue
      }
    done
    echo "✅ Quarantined to: $QUARANTINE"
  else
    echo "❌ Aborted. No changes made."
    rm -rf "$QUARANTINE" "$ARCHIVE_DIR"
    rm -f "$ZIP_OUT"
    exit 0
  fi
fi

echo
echo "== 5) Creating archive backup (belt-and-suspenders) =="
cp -R "$KEEP_MAIN" "$ARCHIVE_DIR/" && cp -R "$KEEP_GOLD" "$ARCHIVE_DIR/"
ARCHIVE_SIZE=$(du -sh "$ARCHIVE_DIR" | cut -f1)
echo "✅ Archive backup: $ARCHIVE_DIR ($ARCHIVE_SIZE)"

echo
echo "== 6) 🎉 CLEANUP COMPLETE =="
echo "  📁 Main repo:       $KEEP_MAIN"
echo "  📁 GOLD snapshot:   $KEEP_GOLD"
echo "  📦 Drive ZIP:       $ZIP_OUT ($ZIP_SIZE)"
echo "  🗄️  Archive backup:  $ARCHIVE_DIR ($ARCHIVE_SIZE)"
[[ -d "$QUARANTINE" && "$(ls -A "$QUARANTINE" 2>/dev/null)" ]] && echo "  🚚 Quarantined:     $QUARANTINE"

echo
echo "✅ SUCCESS: Only the main repo + GOLD snapshot remain active."
echo "📤 Upload to Google Drive: $ZIP_OUT"
echo "🔄 Quarantined items can be restored if needed."
echo
echo "Next steps:"
echo "1. Upload $ZIP_OUT to Google Drive"
echo "2. Test that $KEEP_MAIN still works: cd $KEEP_MAIN && npm run dev"
echo "3. After 30 days, you can safely delete $QUARANTINE and $ARCHIVE_DIR"