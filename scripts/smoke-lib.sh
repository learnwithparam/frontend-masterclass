#!/usr/bin/env bash
# smoke-lib.sh — Shared functions for frontend E2E smoke tests
# Extends the backend smoke-lib with frontend-specific helpers.

set -euo pipefail

# ── Load backend smoke-lib (reuse pass/fail/cleanup/http_*) ────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_LIB="$SCRIPT_DIR/../../backend-masterclass/scripts/smoke-lib.sh"

if [ -f "$BACKEND_LIB" ]; then
  source "$BACKEND_LIB"
else
  echo "ERROR: backend smoke-lib not found at $BACKEND_LIB"
  exit 1
fi

# ── Backend paths ──────────────────────────────────────────────────
BACKEND_03="$SCRIPT_DIR/../../backend-masterclass/03-rest-apis-and-express"
BACKEND_05="$SCRIPT_DIR/../../backend-masterclass/05-auth-and-security"

# ── Start backend for frontend modules ─────────────────────────────
# start_backend_03 — no auth, just CRUD books API
start_backend_03() {
  local port="${1:-3000}"
  echo -e "${YELLOW}Starting backend (module 03) on port ${port}...${NC}"
  pushd "$BACKEND_03" > /dev/null
  start_tsx_server "after/index.ts" "$port"
  popd > /dev/null
}

# start_backend_05 — with auth + CRUD
start_backend_05() {
  local port="${1:-3000}"
  echo -e "${YELLOW}Starting backend (module 05) on port ${port}...${NC}"
  pushd "$BACKEND_05" > /dev/null
  docker_up
  db_push
  start_tsx_server "after/index.ts" "$port"
  popd > /dev/null
}

# ── Frontend dev server helpers ────────────────────────────────────

# start_vite port module_dir
start_vite() {
  local port="$1"
  local dir="$2"
  echo -e "${YELLOW}Starting Vite dev server on port ${port}...${NC}"
  (cd "$dir" && npx vite --port "$port" --strictPort > /dev/null 2>&1) &
  local pid=$!
  SMOKE_PIDS+=("$pid")
  wait_for_http "http://localhost:${port}" 30 1
}

# start_nextjs port module_dir
start_nextjs() {
  local port="$1"
  local dir="$2"
  echo -e "${YELLOW}Starting Next.js dev server on port ${port}...${NC}"
  # Use next start (production) if .next exists, otherwise fall back to dev
  if [ -f "$dir/.next/BUILD_ID" ]; then
    (cd "$dir" && npx next start --port "$port" > /dev/null 2>&1) &
  else
    (cd "$dir" && npx next dev --port "$port" > /dev/null 2>&1) &
  fi
  local pid=$!
  SMOKE_PIDS+=("$pid")
  wait_for_http "http://localhost:${port}" 60 1
}

# ── Auth helpers ───────────────────────────────────────────────────

# register_and_login username password [api_base]
# Returns token on success
register_and_login() {
  local username="$1"
  local password="$2"
  local api="${3:-http://localhost:3000/api}"

  # Register (may fail if user exists, that's OK)
  http_post "${api}/auth/register" "{\"username\":\"${username}\",\"password\":\"${password}\"}" > /dev/null 2>&1 || true

  # Login
  local result
  result=$(http_post "${api}/auth/login" "{\"username\":\"${username}\",\"password\":\"${password}\"}")
  local status=$(echo "$result" | cut -d'|' -f1)
  local body=$(echo "$result" | cut -d'|' -f2-)

  if [ "$status" = "200" ]; then
    extract_json_field "$body" "token"
  else
    echo ""
  fi
}

echo -e "${CYAN}frontend smoke-lib loaded${NC}"
