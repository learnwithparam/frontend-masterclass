# Module 13: Real-Time UI

> "The best UIs don't make you wait. They update before you even think to refresh."

## The Story

The bookstore catalog now shows live stock counts. When another customer buys the last copy of a book, your page updates instantly — no refresh needed. The admin dashboard shows a live feed of every catalog change. Backend module 13 meets its frontend counterpart.

## What You'll Build

- **WebSocket client** with auto-reconnect and exponential backoff
- **Custom hooks** (useWebSocket, useLiveStock, useLiveOrders)
- **Hybrid SSR + WebSocket** — server-rendered initial load, live updates after
- **Connection status indicator** — users always know if they're connected
- **Live order feed** — real-time admin dashboard

## Architecture

```
Server Render (SSR)                Client Hydration
     │                                  │
     ├── fetch /api/books ──────────►   │
     │   (initial data)                 │
     │                                  ├── new WebSocket(ws://...)
     ▼                                  │
  HTML with books                       ├── subscribe("catalog")
  (fast first paint)                    │
                                        ▼
                                   Live updates via WS
                                   ┌─────────────────────┐
                                   │ { type: "book_added" │
                                   │   data: { ... } }    │
                                   └─────────────────────┘
                                        │
                                        ▼
                                   React state update
                                   (instant re-render)
```

## Key Concepts

### Native WebSocket API
We use the browser's built-in `WebSocket` API — no Socket.IO client. This matches the `ws` server from backend module 13 and teaches you the raw protocol.

### Exponential Backoff
When the connection drops, reconnect delays increase: 1s, 2s, 4s, 8s... This prevents a "thundering herd" where thousands of clients reconnect simultaneously after a server restart.

### Hybrid SSR + WebSocket
The initial page load is server-rendered (fast, SEO-friendly). After React hydrates, it opens a WebSocket for live updates. Users see content immediately AND get real-time changes.

## Prerequisites

- Module 08 (Server Actions) completed
- Backend Module 13 (WebSocket server) running
- Docker Desktop running

## Your Task

1. Build a WebSocket client class with auto-reconnect
2. Create a `useWebSocket` hook that manages connection lifecycle
3. Create `useLiveStock` and `useLiveOrders` hooks for specific use cases
4. Build connection status, live stock badge, and live feed components
5. Wire up the catalog page with hybrid SSR + WebSocket

## Testing

```bash
make setup    # Install dependencies
make dev      # Run dev server (start backend module 13 first!)
make smoke    # Run E2E smoke test
```

## Common Mistakes

1. **No reconnect logic** — Connections WILL drop. Always auto-reconnect with backoff.
2. **Thundering herd** — Fixed-delay reconnect after outage. Use exponential backoff.
3. **Memory leaks** — Forgetting to close WebSocket on component unmount. Clean up in useEffect return.
4. **Blocking SSR with WebSocket** — WebSocket is client-only. Use it after hydration, not during SSR.

## What's Next

This completes the frontend masterclass. Combined with the backend modules, you now have a full-stack bookstore with authentication, testing, real-time updates, and production deployment.
