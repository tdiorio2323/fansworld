#!/usr/bin/env bash
set -euo pipefail
SOURCE_DIR="${1:-/Users/tylerdiorio/Downloads/Cabana Files}"
TARGET_DIR="/Users/tylerdiorio/fansworld/public/brand"
mkdir -p "$TARGET_DIR"
copy() {
  local src="$1" dst="$2"
  echo "Copying $src -> $dst"
  cp -f "$src" "$dst"
}
copy "$SOURCE_DIR/CAbana holo log.png" "$TARGET_DIR/cabana-holo-logo.png"
copy "$SOURCE_DIR/GYUP5510 (1).JPG" "$TARGET_DIR/cabana-holo-circle.jpg"
copy "$SOURCE_DIR/Google_AI_Studio_2025-08-28T00_32_11.340Z.png" "$TARGET_DIR/cabana-wordmark-spotlight.png"
copy "$SOURCE_DIR/CABANA Brand Identity Kit.png" "$TARGET_DIR/cabana-brand-kit.png"
copy "$SOURCE_DIR/Google_AI_Studio_2025-08-28T00_36_51.651Z.png" "$TARGET_DIR/cabana-holo-stage.png"
