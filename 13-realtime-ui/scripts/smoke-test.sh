#!/usr/bin/env bash
# Module 13: Smoke Test — Real-Time UI (requires Backend module 13)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$MODULE_DIR/../scripts/smoke-lib.sh"

cd "$MODULE_DIR"
require_commands node curl jq nc docker

echo -e "${CYAN}Module 13: Real-Time UI — Smoke Test${NC}"
echo ""

# ── Start backend (module 13 with WebSocket support) ──────────────
BACKEND_13="$SCRIPT_DIR/../../backend-masterclass/13-realtime-websockets"
echo -e "${YELLOW}Starting backend (module 13) on port 3000...${NC}"
pushd "$BACKEND_13" > /dev/null
docker_up
db_push
start_tsx_server "after/index.ts" 3000
popd > /dev/null

# ── Start frontend ───────────────────────────────────────────────
start_nextjs 3001 "$MODULE_DIR"

# ── Test 1: Frontend serves ──────────────────────────────────────
STATUS=$(http_get "http://localhost:3001")
if [ "$STATUS" = "200" ]; then
  pass "Frontend serves on localhost:3001"
else
  fail "Frontend serves on localhost:3001 (got: $STATUS)"
fi

# ── Test 1b: Homepage renders actual content ─────────────────────
BODY=$(http_get_body "http://localhost:3001")
if echo "$BODY" | grep -q "Book Catalog"; then
  pass "Homepage renders Book Catalog heading"
else
  fail "Homepage renders Book Catalog heading"
fi

# ── Test 2: Dashboard page serves ────────────────────────────────
STATUS=$(http_get "http://localhost:3001/dashboard")
if [ "$STATUS" = "200" ]; then
  pass "Dashboard page serves on localhost:3001/dashboard"
else
  fail "Dashboard page serves (got: $STATUS)"
fi

# ── Test 2b: Dashboard renders with live features ────────────────
BODY=$(http_get_body "http://localhost:3001/dashboard")
if echo "$BODY" | grep -qi "live\|real-time\|dashboard"; then
  pass "Dashboard renders with live features"
else
  fail "Dashboard renders with live features"
fi

# ── Test 3: Backend WebSocket is running ─────────────────────────
# Register + login to get a token
API="http://localhost:3000/api"
TOKEN=$(register_and_login "wsuser13_$(date +%s)" "password123" "$API")
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  pass "Backend auth works for WebSocket token"
else
  fail "Backend auth works for WebSocket token"
fi

check_result
