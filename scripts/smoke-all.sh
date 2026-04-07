#!/usr/bin/env bash
# smoke-all.sh — Run all frontend module smoke tests sequentially
# Usage: bash scripts/smoke-all.sh [module_number]
#   No args  → runs all 13 modules
#   With arg → runs only that module (e.g., "bash scripts/smoke-all.sh 04")

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

MODULES=(
  "01-dom-and-data"
  "02-client-server-sync"
  "03-native-css-layout"
  "04-stateless-auth"
  "05-react-tailwind-foundations"
  "06-react-routing-and-state"
  "07-nextjs-server-rendering"
  "08-nextjs-server-actions"
  "09-optimistic-ui-streaming"
  "10-frontend-deployment"
  "11-frontend-testing"
  "12-forms-and-validation"
  "13-realtime-ui"
)

PASSED=()
FAILED=()
SKIPPED=()

run_module_smoke() {
  local module="$1"
  local module_dir="$ROOT_DIR/$module"
  local smoke_script="$module_dir/scripts/smoke-test.sh"

  echo ""
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${CYAN}  $module${NC}"
  echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

  if [ ! -f "$smoke_script" ]; then
    echo -e "  ${YELLOW}SKIP${NC} — no scripts/smoke-test.sh found"
    SKIPPED+=("$module")
    return 0
  fi

  if [ -f "$module_dir/package.json" ] && [ ! -d "$module_dir/node_modules" ]; then
    echo -e "  ${YELLOW}Installing dependencies...${NC}"
    (cd "$module_dir" && npm install --silent 2>/dev/null)
  fi

  if bash "$smoke_script"; then
    PASSED+=("$module")
  else
    FAILED+=("$module")
  fi
}

# ── Filter by module number if provided ─────────────────────────────
if [ "${1:-}" != "" ]; then
  FILTER="$1"
  FILTERED=()
  for m in "${MODULES[@]}"; do
    if [[ "$m" == "$FILTER"* ]]; then
      FILTERED+=("$m")
    fi
  done
  if [ ${#FILTERED[@]} -eq 0 ]; then
    echo -e "${RED}No module matching '$FILTER'${NC}"
    exit 1
  fi
  MODULES=("${FILTERED[@]}")
fi

echo -e "${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║       Frontend Masterclass — Smoke Tests            ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${NC}"
echo -e "Running ${#MODULES[@]} module(s)..."

for module in "${MODULES[@]}"; do
  run_module_smoke "$module"
done

# ── Summary ─────────────────────────────────────────────────────────
echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║                    SUMMARY                          ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════╝${NC}"

if [ ${#PASSED[@]} -gt 0 ]; then
  echo -e "${GREEN}Passed (${#PASSED[@]}):${NC}"
  for m in "${PASSED[@]}"; do
    echo -e "  ${GREEN}✓${NC} $m"
  done
fi

if [ ${#SKIPPED[@]} -gt 0 ]; then
  echo -e "${YELLOW}Skipped (${#SKIPPED[@]}):${NC}"
  for m in "${SKIPPED[@]}"; do
    echo -e "  ${YELLOW}○${NC} $m"
  done
fi

if [ ${#FAILED[@]} -gt 0 ]; then
  echo -e "${RED}Failed (${#FAILED[@]}):${NC}"
  for m in "${FAILED[@]}"; do
    echo -e "  ${RED}✗${NC} $m"
  done
  echo ""
  echo -e "${RED}SOME SMOKE TESTS FAILED${NC}"
  exit 1
fi

echo ""
echo -e "${GREEN}ALL SMOKE TESTS PASSED${NC}"
