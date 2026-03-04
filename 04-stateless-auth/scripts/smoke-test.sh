#!/usr/bin/env bash
# Module 04: Smoke Test — Stateless Auth (requires Docker for backend)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$MODULE_DIR/../scripts/smoke-lib.sh"

cd "$MODULE_DIR"
require_commands node curl jq nc docker

echo -e "${CYAN}Module 04: Stateless Auth — Smoke Test${NC}"
echo ""

API="http://localhost:3000/api"
TEST_USER="smoketest_$(date +%s)"
TEST_PASS="SmokePass123!"

# ── Start backend ────────────────────────────────────────────────────
start_backend_05 3000

# ── Test 1: Register ────────────────────────────────────────────────
RESULT=$(http_post "$API/auth/register" "{\"username\":\"${TEST_USER}\",\"password\":\"${TEST_PASS}\"}")
REG_STATUS=$(echo "$RESULT" | cut -d'|' -f1)
if [ "$REG_STATUS" = "201" ]; then
  pass "POST /api/auth/register returns 201"
else
  fail "POST /api/auth/register returns 201 (got: $REG_STATUS)"
fi

# ── Test 2: Login returns token ─────────────────────────────────────
TOKEN=$(register_and_login "$TEST_USER" "$TEST_PASS" "$API")
if [ -n "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  pass "Login returns JWT token"
else
  fail "Login returns JWT token"
fi

# ── Test 3: POST /api/books with customer token → 403 (admin only) ─
RESULT=$(http_post "$API/books" '{"title":"Auth Test","author":"Smoke","pages":50,"published":"2024"}' "Bearer $TOKEN")
AUTH_STATUS=$(echo "$RESULT" | cut -d'|' -f1)
if [ "$AUTH_STATUS" = "403" ]; then
  pass "POST /api/books with customer token returns 403"
else
  fail "POST /api/books with customer token returns 403 (got: $AUTH_STATUS)"
fi

# ── Test 4: POST /api/books without auth → 401 ─────────────────────
RESULT=$(http_post "$API/books" '{"title":"No Auth","author":"Test","pages":10,"published":"2024"}')
NOAUTH_STATUS=$(echo "$RESULT" | cut -d'|' -f1)
if [ "$NOAUTH_STATUS" = "401" ]; then
  pass "POST /api/books without token returns 401"
else
  fail "POST /api/books without token returns 401 (got: $NOAUTH_STATUS)"
fi

check_result
