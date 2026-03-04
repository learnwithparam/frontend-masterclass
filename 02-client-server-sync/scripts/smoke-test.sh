#!/usr/bin/env bash
# Module 02: Smoke Test — Client-Server Sync
# Tests backend API that this module's frontend connects to.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$MODULE_DIR/../scripts/smoke-lib.sh"

cd "$MODULE_DIR"
require_commands node curl jq nc

echo -e "${CYAN}Module 02: Client-Server Sync — Smoke Test${NC}"
echo ""

# ── Start backend ────────────────────────────────────────────────────
start_backend_03 3000

BASE="http://localhost:3000/api/books"

# ── Test 1: GET /api/books → 200 ───────────────────────────────────
STATUS=$(http_get "$BASE")
if [ "$STATUS" = "200" ]; then
  pass "GET /api/books returns 200"
else
  fail "GET /api/books returns 200 (got: $STATUS)"
fi

# ── Test 2: POST /api/books → 201 ──────────────────────────────────
RESULT=$(http_post "$BASE" '{"title":"Smoke Test","author":"Tester","pages":100,"published":"2024"}')
POST_STATUS=$(echo "$RESULT" | cut -d'|' -f1)
if [ "$POST_STATUS" = "201" ]; then
  pass "POST /api/books returns 201"
else
  fail "POST /api/books returns 201 (got: $POST_STATUS)"
fi

check_result
