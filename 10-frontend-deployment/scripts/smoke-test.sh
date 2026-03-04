#!/usr/bin/env bash
# Module 10: Smoke Test — Frontend Deployment (requires Docker)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$MODULE_DIR/../scripts/smoke-lib.sh"

cd "$MODULE_DIR"
require_commands node curl jq nc docker

echo -e "${CYAN}Module 10: Frontend Deployment — Smoke Test${NC}"
echo ""

API="http://localhost:3000/api"

# ── Start servers ────────────────────────────────────────────────────
start_backend_05 3000
start_nextjs 3001 "$MODULE_DIR"

# ── Test 1: Frontend serves ─────────────────────────────────────────
STATUS=$(http_get "http://localhost:3001")
if [ "$STATUS" = "200" ]; then
  pass "Frontend serves on localhost:3001"
else
  fail "Frontend serves on localhost:3001 (got: $STATUS)"
fi

# ── Test 2: Auth flow ───────────────────────────────────────────────
TOKEN=$(register_and_login "smokeuser10_$(date +%s)" "password123" "$API")
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  pass "Register + login returns token"
else
  fail "Register + login returns token"
fi

# ── Test 3: Login page serves ───────────────────────────────────────
STATUS=$(http_get "http://localhost:3001/login")
if [ "$STATUS" = "200" ]; then
  pass "Login page serves on localhost:3001/login"
else
  fail "Login page serves on localhost:3001/login (got: $STATUS)"
fi

check_result
