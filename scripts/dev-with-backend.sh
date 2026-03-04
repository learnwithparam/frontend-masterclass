#!/usr/bin/env bash
# dev-with-backend.sh — Start backend + frontend with one command
# Usage: dev-with-backend.sh <backend-module-dir> <frontend-cmd> [port]

set -euo pipefail

BACKEND_DIR="$(cd "$1" && pwd)"
FRONTEND_CMD="$2"
PORT="${3:-3000}"

# Colors
CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'

BACKEND_PID=""
cleanup() {
  echo ""
  echo -e "${YELLOW}Shutting down backend...${NC}"
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null || true
}
trap cleanup EXIT

# Start Docker if needed
if [ -f "$BACKEND_DIR/docker-compose.yml" ]; then
  echo -e "${CYAN}Starting Docker services...${NC}"
  (cd "$BACKEND_DIR" && docker compose up -d)
  echo "Waiting for database..."
  sleep 3
  echo -e "${CYAN}Pushing database schema...${NC}"
  (cd "$BACKEND_DIR" && npx drizzle-kit push 2>/dev/null || npx drizzle-kit push)
fi

# Start backend in background
echo -e "${GREEN}Starting backend on port ${PORT}...${NC}"
(cd "$BACKEND_DIR" && npx tsx after/index.ts) &
BACKEND_PID=$!

# Wait for backend
for i in $(seq 1 30); do
  if nc -z localhost "$PORT" 2>/dev/null; then
    echo -e "${GREEN}Backend ready on port ${PORT}${NC}"
    break
  fi
  [ "$i" -eq 30 ] && echo -e "${RED}Backend failed to start${NC}" && exit 1
  sleep 1
done

# Start frontend (foreground — Ctrl+C triggers cleanup)
echo -e "${GREEN}Starting frontend...${NC}"
eval "$FRONTEND_CMD"
