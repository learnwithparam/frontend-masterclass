# Module 10: Production Deployment & Observability (`10-frontend-deployment`)

This is the finish line. We take the application we've built across 9 modules and ship it to production. This module mirrors `backend-masterclass/11-ship-it` — but for the frontend.

## Concepts Covered

### 1. Multi-Stage Dockerfile (Next.js)
```dockerfile
FROM node:20-alpine AS builder
# ... install deps, build ...

FROM node:20-alpine AS runner
# ... copy only production files ...
```
The builder stage compiles the Next.js app. The runner stage contains only the production bundle — no `node_modules`, no source code. This shrinks the image from ~1GB to ~200MB.

### 2. Next.js Standalone Output
Setting `output: 'standalone'` in `next.config.ts` produces a self-contained `server.js` with all dependencies inlined. No `npm install` needed in the production image.

### 3. Full-Stack Docker Compose
The `docker-compose.yml` brings up the **entire application**:
- PostgreSQL (database)
- Redis (caching, pub/sub)
- Backend API (from `backend-masterclass/11-ship-it`)
- Frontend (this Next.js app)

One command: `docker compose up --build`

### 4. Environment Variables
The frontend communicates with the backend via `BACKEND_URL=http://backend:3000/api`. Inside Docker's network, services reference each other by name. The browser never sees this URL — Server Actions proxy all requests.

### 5. GitHub Actions CI
A basic CI pipeline that runs `lint` and `build` on every push. This catches TypeScript errors and broken imports before they reach production.

## How to Run the Entire Stack
```bash
docker compose up --build
```
- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:3000`

### Port Map

- `3000` - backend API
- `3001` - frontend app
- `3002` - frontend testing app during Playwright runs

These ports are intentionally fixed so the frontend course can sit beside the backend masterclass without cross-course collisions.

## Course Summary

| Module | Technology | Key Concepts |
|--------|-----------|--------------|
| 01 | HTML/JS | DOM, `fetch`, `createElement` |
| 02 | Vanilla JS | Live API, `POST`, Error Handling |
| 03 | CSS | Grid, Flexbox, Media Queries, Variables |
| 04 | Vanilla JS | JWT, `localStorage`, Bearer Headers |
| 05 | React + Tailwind | Components, `useState`, `useEffect` |
| 06 | React Router | Routing, Context API, Custom Hooks |
| 07 | Next.js | SSR, Server Components, File Routing |
| 08 | Next.js | Server Actions, httpOnly Cookies, BFF |
| 09 | Next.js | Suspense, Streaming, Optimistic UI |
| 10 | Docker/CI | Dockerfile, Compose, GitHub Actions |
