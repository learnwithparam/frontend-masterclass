#!/usr/bin/env bash
# Module 11: Smoke Test — Frontend Testing

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$MODULE_DIR/../scripts/smoke-lib.sh"

cd "$MODULE_DIR"
require_commands node curl jq nc docker

echo -e "${CYAN}Module 11: Frontend Testing — Smoke Test${NC}"
echo ""

# ── Run unit + component tests ─────────────────────────────────────
if npx vitest run 2>&1; then
  pass "Vitest unit + component tests pass"
else
  fail "Vitest unit + component tests pass"
fi

# ── Start backend for frontend serving test ────────────────────────
API="http://localhost:3000/api"
start_backend_05 3000
register_compose_dir "$BACKEND_05"
start_nextjs 3001 "$MODULE_DIR"

# ── Test: Frontend serves ──────────────────────────────────────────
STATUS=$(http_get "http://localhost:3001")
if [ "$STATUS" = "200" ]; then
  pass "Frontend serves on localhost:3001"
else
  fail "Frontend serves on localhost:3001 (got: $STATUS)"
fi

# ── Test: Homepage renders actual content ─────────────────────────
BODY=$(http_get_body "http://localhost:3001")
if echo "$BODY" | grep -q "Book Catalog"; then
  pass "Homepage renders Book Catalog heading"
else
  fail "Homepage renders Book Catalog heading"
fi

# ── Test: Login page serves ────────────────────────────────────────
STATUS=$(http_get "http://localhost:3001/login")
if [ "$STATUS" = "200" ]; then
  pass "Login page serves on localhost:3001/login"
else
  fail "Login page serves on localhost:3001/login (got: $STATUS)"
fi

check_result
