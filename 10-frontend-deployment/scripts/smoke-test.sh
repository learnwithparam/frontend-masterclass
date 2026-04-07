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
register_compose_dir "$BACKEND_05"
start_nextjs 3001 "$MODULE_DIR"

# ── Test 0: Deployment artifacts exist and match the lesson ────────
if grep -Fq "FROM node:20-alpine AS builder" Dockerfile && \
   grep -Fq "FROM node:20-alpine AS runner" Dockerfile && \
   grep -Fq "EXPOSE 3001" Dockerfile; then
  pass "Dockerfile uses multi-stage standalone deployment"
else
  fail "Dockerfile uses multi-stage standalone deployment"
fi

if grep -Fq "output: 'standalone'" next.config.ts; then
  pass "Next config enables standalone output"
else
  fail "Next config enables standalone output"
fi

if grep -Fq "npm run lint" .github/workflows/ci.yml && \
   grep -Fq "npm run build" .github/workflows/ci.yml; then
  pass "GitHub Actions CI checks lint and build"
else
  fail "GitHub Actions CI checks lint and build"
fi

if grep -Fq '3001:3001' docker-compose.yml && \
   grep -Fq 'BACKEND_URL=http://backend:3000/api' docker-compose.yml; then
  pass "Docker Compose wires frontend and backend ports correctly"
else
  fail "Docker Compose wires frontend and backend ports correctly"
fi

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
