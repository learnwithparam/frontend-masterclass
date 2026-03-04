# Module 09: Masterclass UX — Optimistic UI & Streaming (`09-optimistic-ui-streaming`)

This module brings together everything we've learned into a production-grade user experience. We solve the two biggest UX problems in web applications: **perceived latency** and **waterfall data loading**.

## Concepts Covered

### 1. Streaming SSR with React Suspense
In Module 07, the entire page waited for the server to finish fetching ALL data before sending anything. With Streaming, the shell (navbar, heading, skeleton) is sent **immediately**, and the book grid streams in when the data is ready.

```jsx
<Suspense fallback={<BookGridSkeleton />}>
  <AsyncBookGrid />    {/* This streams in when ready */}
</Suspense>
```

The user sees a loading skeleton instantly instead of a blank page. This dramatically improves perceived performance.

### 2. Optimistic UI (`useOptimistic`)
When the user adds a book, we don't wait for the server to confirm. We update the UI **immediately** with the new book (shown in a pulsing indigo card), then let the Server Action confirm in the background.

If the server fails, the optimistic update disappears and an error message appears. This is the same pattern used by Twitter, Instagram, and Slack.

### 3. Loading Skeletons
Instead of spinners, we use skeleton cards that match the shape of the real content. This reduces [Cumulative Layout Shift (CLS)](https://web.dev/cls/) — a Core Web Vital that affects your Google search ranking.

### 4. Accessibility (a11y)
- Semantic HTML (`<main>`, `<nav>`, `<header>`)
- Proper `<label>` associations
- Disabled states on buttons during mutations
- Color contrast ratios meeting WCAG guidelines

## How to Run
```bash
npm run dev
```
Add a book from `/dashboard` and watch it appear instantly!
