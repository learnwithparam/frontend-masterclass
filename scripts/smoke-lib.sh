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
SMOKE_COMPOSE_DIRS=()

register_compose_dir() {
  local dir="$1"
  SMOKE_COMPOSE_DIRS+=("$dir")
}

cleanup() {
  for pid in "${SMOKE_PIDS[@]:-}"; do
    kill "$pid" 2>/dev/null || true
    wait "$pid" 2>/dev/null || true
  done
  SMOKE_PIDS=()

  for port in 3000 3001 3002 5173; do
    lsof -ti ":$port" 2>/dev/null | xargs kill -9 2>/dev/null || true
  done

  for f in ${SMOKE_WRAPPERS:-}; do
    rm -f "$f" 2>/dev/null || true
  done

  for dir in "${SMOKE_COMPOSE_DIRS[@]:-}"; do
    if [ -f "$dir/docker-compose.yml" ]; then
      (cd "$dir" && docker compose down -v 2>/dev/null) || true
    fi
  done
}

trap cleanup EXIT

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
  register_compose_dir "$BACKEND_05"
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
  # Smoke tests should exercise the current source tree, not a stale build.
  (cd "$dir" && npx next dev --port "$port" > /dev/null 2>&1) &
  local pid=$!
  SMOKE_PIDS+=("$pid")
  wait_for_http "http://localhost:${port}" 120 1
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
