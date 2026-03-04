#!/usr/bin/env bash
# smoke-test.sh — Module 01: DOM and Data
# Tests that all required static files exist and books.json is valid JSON.
# No server required.

set -euo pipefail

MODULE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
source "$MODULE_DIR/../scripts/smoke-lib.sh"

echo ""
echo "============================================"
echo "  Module 01 — DOM and Data: Smoke Test"
echo "============================================"
echo ""

# ── File existence checks ───────────────────────────────────────────

echo "Checking required static files..."

if [ -f "$MODULE_DIR/index.html" ]; then
  pass "index.html exists"
else
  fail "index.html not found"
fi

if [ -f "$MODULE_DIR/script.js" ]; then
  pass "script.js exists"
else
  fail "script.js not found"
fi

if [ -f "$MODULE_DIR/books.json" ]; then
  pass "books.json exists"
else
  fail "books.json not found"
fi

# ── JSON validity check ─────────────────────────────────────────────

echo ""
echo "Checking books.json is valid JSON..."

if python3 -m json.tool "$MODULE_DIR/books.json" > /dev/null 2>&1; then
  pass "books.json is valid JSON"
else
  fail "books.json is not valid JSON"
fi

# ── Summary ─────────────────────────────────────────────────────────

echo ""
echo "============================================"
echo "  All checks passed."
echo "============================================"
echo ""
