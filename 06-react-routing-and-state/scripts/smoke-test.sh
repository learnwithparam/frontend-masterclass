#!/usr/bin/env bash
# Module 06: Smoke Test — React Routing + State (requires Docker)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$MODULE_DIR/../scripts/smoke-lib.sh"

cd "$MODULE_DIR"
require_commands node curl jq nc docker

echo -e "${CYAN}Module 06: React Routing & State — Smoke Test${NC}"
echo ""

API="http://localhost:3000/api"

# ── Start servers ────────────────────────────────────────────────────
start_backend_05 3000
register_compose_dir "$BACKEND_05"
start_vite 5173 "$MODULE_DIR"

# ── Test 1: Frontend serves ─────────────────────────────────────────
STATUS=$(http_get "http://localhost:5173")
if [ "$STATUS" = "200" ]; then
  pass "Frontend serves on localhost:5173"
else
  fail "Frontend serves on localhost:5173 (got: $STATUS)"
fi

# ── Test 2: Auth flow ───────────────────────────────────────────────
TOKEN=$(register_and_login "smokeuser06_$(date +%s)" "password123" "$API")
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  pass "Register + login returns token"
else
  fail "Register + login returns token"
fi

# ── Test 3: GET /api/books (public) ──────────────────────────────────
STATUS=$(http_get "$API/books")
if [ "$STATUS" = "200" ]; then
  pass "GET /api/books returns 200"
else
  fail "GET /api/books returns 200 (got: $STATUS)"
fi

check_result
