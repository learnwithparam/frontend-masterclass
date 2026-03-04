# Module 07: Next.js App Router & SSR (`07-nextjs-server-rendering`)

This is the paradigm shift. In Modules 05–06, we rendered everything on the **client** — the browser downloaded an empty HTML shell, then JavaScript fetched data and built the UI. This is called **Client-Side Rendering (CSR)**.

Next.js flips this: the **server** fetches data and renders the full HTML *before* sending it to the browser. This is **Server-Side Rendering (SSR)**.

## Why Does This Matter?

| | CSR (React SPA) | SSR (Next.js) |
|---|---|---|
| **Initial Load** | Empty page → spinner → content | Full HTML immediately |
| **SEO** | Search engines see nothing | Search engines see all content |
| **TTFB** | Fast (tiny HTML) | Slightly slower (server work) |
| **LCP** | Slow (JS must parse + fetch) | Fast (content in first response) |

## Concepts Covered

### 1. React Server Components (RSC)
In Next.js App Router, every component is a **Server Component** by default. The catalog `page.tsx` uses `async/await` directly — no `useState`, no `useEffect`. Data fetching happens on the server.

### 2. Client Components (`'use client'`)
When a component needs interactivity (form inputs, useState, onClick handlers), you add `'use client'` at the top, making it a Client Component. The login page is a Client Component because it has form state.

### 3. File-System Routing
- `src/app/page.tsx` → Route: `/`
- `src/app/login/page.tsx` → Route: `/login`

No React Router needed. Next.js reads the folder structure.

### 4. Metadata & SEO
The `layout.tsx` exports a `metadata` object that sets the page title and description. Next.js injects these into `<head>` automatically.

## The Key Insight
**View Page Source** on the catalog page. You'll see all the book data is already in the HTML. In Module 06's React SPA, View Source would show an empty `<div id="root"></div>`.

## How to Run
```bash
npm run dev
```
Visit `http://localhost:3000` (Next.js default port). Make sure the backend API is running.
