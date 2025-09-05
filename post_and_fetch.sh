#!/usr/bin/env bash
set -euo pipefail

# Requires: ./.cabana_assistant.env with OPENAI_API_KEY, CABANA_ASSISTANT, CABANA_THREAD
source ./.cabana_assistant.env
API="https://api.openai.com/v1"
AUTH=(-H "Authorization: Bearer $OPENAI_API_KEY" -H "OpenAI-Beta: assistants=v2")
JSON=(-H "Content-Type: application/json")

# Read task from arg or file
if [[ $# -lt 1 ]]; then echo "Usage: ./post_and_fetch.sh 'TASK text' | ./post_and_fetch.sh task.txt"; exit 1; fi
if [[ -f "$1" ]]; then TASK="$(cat "$1")"; else TASK="$1"; fi

# 1) Post message to existing thread
curl -s "$API/threads/messages" "${AUTH[@]}" "${JSON[@]}" \
  -d "$(jq -n --arg th "$CABANA_THREAD" --arg t "$TASK" '{thread_id:$th, role:"user", content:$t}')" >/dev/null

# 2) Start run
RUN=$(curl -s "$API/threads/runs" "${AUTH[@]}" "${JSON[@]}" \
  -d "$(jq -n --arg th "$CABANA_THREAD" --arg as "$CABANA_ASSISTANT" '{thread_id:$th, assistant_id:$as}')" | jq -r .id)
echo "Run: $RUN"

# 3) Poll
printf "Polling"
while true; do
  sleep 3
  STATUS=$(curl -s "$API/threads/runs/$RUN" "${AUTH[@]}" | jq -r .status)
  printf "."
  [[ "$STATUS" =~ ^(completed|failed|expired|cancelled)$ ]] && break
done
echo; echo "Status: $STATUS"
[[ "$STATUS" != "completed" ]] && { echo "Run not completed. Inspect: curl -s $API/threads/runs/$RUN ${AUTH[@]} | jq"; exit 2; }

# 4) Fetch messages and extract zip URLs
MSG_JSON=$(mktemp)
curl -s "$API/threads/$CABANA_THREAD/messages" "${AUTH[@]}" > "$MSG_JSON"
ZIP_URLS=$(jq -r '.[].content[]?.text?.value // empty' "$MSG_JSON" | grep -Eo 'https?://[^ ]+\.zip' || true)

if [[ -z "$ZIP_URLS" ]]; then
  echo "No zip links found."
  exit 0
fi

# 5) Download all zips and unzip
i=1
while read -r URL; do
  OUT="cabana_pack_$i.zip"
  echo "Downloading: $URL -> $OUT"
  curl -L -o "$OUT" "$URL"
  unzip -o "$OUT" -d .
  i=$((i+1))
done <<< "$ZIP_URLS"

echo "Done."

