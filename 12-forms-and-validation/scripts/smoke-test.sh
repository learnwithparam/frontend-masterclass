#!/usr/bin/env bash
# Module 12: Smoke Test — Forms & Validation

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$MODULE_DIR/../scripts/smoke-lib.sh"

cd "$MODULE_DIR"
require_commands node curl jq nc docker

echo -e "${CYAN}Module 12: Forms & Validation — Smoke Test${NC}"
echo ""

API="http://localhost:3000/api"

# ── Start backend (module 12 with file uploads) ───────────────────
BACKEND_12="$SCRIPT_DIR/../../backend-masterclass/12-api-hardening"
echo -e "${YELLOW}Starting backend (module 12) on port 3000...${NC}"
pushd "$BACKEND_12" > /dev/null
docker_up
db_push
start_tsx_server "after/index.ts" 3000
popd > /dev/null

# ── Start frontend ────────────────────────────────────────────────
start_nextjs 3001 "$MODULE_DIR"

# ── Test 1: Frontend serves ───────────────────────────────────────
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

# ── Test 2: Add book page serves ─────────────────────────────────
STATUS=$(http_get "http://localhost:3001/dashboard/add-book")
if [ "$STATUS" = "200" ]; then
  pass "Add book page serves on localhost:3001/dashboard/add-book"
else
  fail "Add book page serves (got: $STATUS)"
fi

# ── Test 2b: Add book form renders with fields ──────────────────
BODY=$(http_get_body "http://localhost:3001/dashboard/add-book")
if echo "$BODY" | grep -q "Title" && echo "$BODY" | grep -q "Author"; then
  pass "Add book form renders with fields"
else
  fail "Add book form renders with fields"
fi

# ── Test 3: Login page serves ────────────────────────────────────
STATUS=$(http_get "http://localhost:3001/login")
if [ "$STATUS" = "200" ]; then
  pass "Login page serves on localhost:3001/login"
else
  fail "Login page serves (got: $STATUS)"
fi

check_result
