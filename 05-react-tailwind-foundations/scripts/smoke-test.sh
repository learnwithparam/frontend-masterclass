#!/usr/bin/env bash
# Module 05: Smoke Test — React + Tailwind (Vite)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
source "$MODULE_DIR/../scripts/smoke-lib.sh"

cd "$MODULE_DIR"
require_commands node curl nc

echo -e "${CYAN}Module 05: React + Tailwind — Smoke Test${NC}"
echo ""

# ── Start servers ────────────────────────────────────────────────────
start_backend_03 3000
start_vite 5173 "$MODULE_DIR"

# ── Test 1: Frontend serves ─────────────────────────────────────────
STATUS=$(http_get "http://localhost:5173")
if [ "$STATUS" = "200" ]; then
  pass "Frontend serves on localhost:5173"
else
  fail "Frontend serves on localhost:5173 (got: $STATUS)"
fi

# ── Test 2: Backend API works ────────────────────────────────────────
STATUS=$(http_get "http://localhost:3000/api/books")
if [ "$STATUS" = "200" ]; then
  pass "GET /api/books returns 200"
else
  fail "GET /api/books returns 200 (got: $STATUS)"
fi

check_result
