#!/usr/bin/env bash
set -euo pipefail

require() { command -v "$1" >/dev/null 2>&1 || { echo "Missing $1. Install it. (brew install $1)"; exit 1; }; }
require curl
require jq

echo "Enter your OpenAI API key (sk-...):"
read -r OPENAI_API_KEY
export OPENAI_API_KEY

read -r -p "Path to your Cabana zip (optional, Enter to skip): " CABANA_ZIP || true
TASK1='TASK 1 — Auth + DB pack
Generate Supabase SQL and Next.js App Router code:
- Tables: users (uuid pk), creators (uuid pk, user_id fk, display_name, handle unique, bio, avatar_url),
  subscriptions (pk, user_id fk, creator_id fk, status enum[active,canceled], current_period_end timestamptz),
  vip_codes (pk, code unique, creator_id fk, expires_at, max_uses, uses int default 0),
  posts (pk, creator_id fk, url, mime, vip_only boolean default false, created_at).
- RLS: public read on creators; strict elsewhere. Storage policy: creator can read/write own; public read when vip_only=false.
- Pages/APIs:
  /app/(auth)/login/page.tsx (glass card, magic link),
  /app/api/auth/*, /app/api/profile,
  lib/supabase.ts, zod validation.
Return:
BEGIN FILES...END FILES with exact paths. Also create cabana_auth_pack.zip via Code Interpreter and provide setup steps and a 30s test checklist.
Brand: luxury glassmorphism, chrome gradient accents.'

SYS_INSTRUCTIONS='You are Cabana Platform Assistant.
Hard constraints:
- Output multi-file code drops with exact paths using:
  BEGIN FILES
  FILE: path/to/file.ext
  <code>
  END FILES
- If >5 files, also create a ZIP via Code Interpreter and return a download link.
- Stack: Next.js 15 App Router + TypeScript + Tailwind + shadcn/ui + Framer Motion + Supabase + Stripe.
- No Firebase. No filler. No apologies.
- If info is missing, assume sane defaults and continue.'

echo "Creating vector store..."
VSTORE=$(curl -s https://api.openai.com/v1/vector_stores \
  -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" \
  -d '{"name":"cabana_store"}' | jq -r .id)
echo "Vector store: $VSTORE"

if [[ -n "${CABANA_ZIP:-}" && -f "$CABANA_ZIP" ]]; then
  echo "Uploading file: $CABANA_ZIP"
  FILE_ID=$(curl -s https://api.openai.com/v1/files \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -F purpose="user_data" \
    -F file="@$CABANA_ZIP" | jq -r .id)
  echo "File id: $FILE_ID"

  echo "Attaching file to vector store..."
  curl -s https://api.openai.com/v1/vector_stores/$VSTORE/files \
    -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" \
    -d "{\"file_id\":\"$FILE_ID\"}" >/dev/null
fi

echo "Creating assistant..."
ASST=$(curl -s https://api.openai.com/v1/assistants \
  -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" \
  -d "$(jq -n --arg instr "$SYS_INSTRUCTIONS" --arg vs "$VSTORE" '{
    name:"Cabana Platform Assistant",
    model:"gpt-5",
    instructions:$instr,
    tools:[{type:"file_search"},{type:"code_interpreter"},{type:"web_search"}],
    tool_resources:{ file_search:{ vector_store_ids: [$vs] } }
  }')" | jq -r .id)
echo "Assistant: $ASST"

echo "Creating thread with Task 1..."
THREAD=$(curl -s https://api.openai.com/v1/threads \
  -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" \
  -d "$(jq -n --arg t "$TASK1" '{messages:[{role:"user",content:$t}]}')" | jq -r .id)
echo "Thread: $THREAD"

echo "Starting run..."
RUN=$(curl -s https://api.openai.com/v1/threads/runs \
  -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" \
  -d "$(jq -n --arg th "$THREAD" --arg as "$ASST" '{thread_id:$th, assistant_id:$as}')" | jq -r .id)
echo "Run: $RUN"

STATUS="queued"
printf "Polling"
while true; do
  sleep 3
  STATUS=$(curl -s https://api.openai.com/v1/threads/runs/$RUN \
    -H "Authorization: Bearer $OPENAI_API_KEY" | jq -r .status)
  printf "."
  [[ "$STATUS" == "completed" || "$STATUS" == "failed" || "$STATUS" == "expired" || "$STATUS" == "cancelled" ]] && break
done
echo
echo "Run status: $STATUS"

echo "Messages:"
curl -s "https://api.openai.com/v1/threads/$THREAD/messages" \
  -H "Authorization: Bearer $OPENAI_API_KEY" | jq

# Save IDs for reuse
cat > .cabana_assistant.env <<EOF
export OPENAI_API_KEY="$OPENAI_API_KEY"
export CABANA_VECTOR_STORE="$VSTORE"
export CABANA_ASSISTANT="$ASST"
export CABANA_THREAD="$THREAD"
EOF
echo "Saved env to .cabana_assistant.env"

