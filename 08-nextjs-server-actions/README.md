# Module 08: Backend-For-Frontend (BFF) Pattern (`08-nextjs-server-actions`)

In Module 07, we still used `localStorage` on the login page and called the backend API directly from the browser. This is a security risk in production — the backend URL is exposed, and `localStorage` is vulnerable to XSS attacks.

**Server Actions** fix both problems.

## The BFF Pattern

```
Browser → Next.js Server (BFF) → Backend API
```

The browser never talks to the backend directly. Instead:
1. The form calls a **Server Action** (a function that runs on the Next.js server).
2. The Server Action calls the backend API with the JWT.
3. The JWT is stored in an **httpOnly cookie** — invisible to JavaScript.

## Concepts Covered

### 1. Server Actions (`'use server'`)
Functions marked with `'use server'` can be called from `<form action={...}>`. They execute on the server, have access to `cookies()`, and can `redirect()`.

### 2. httpOnly Cookies
```typescript
cookies().set('token', data.token, { httpOnly: true })
```
Unlike `localStorage`, an httpOnly cookie cannot be read by JavaScript. It's automatically sent with every request. This prevents XSS attacks from stealing the token.

### 3. `revalidatePath('/')`
After adding a book, we call `revalidatePath('/')` to tell Next.js to refetch the catalog data on the next request. This is **cache invalidation** — the hardest problem in computing, made simple.

### 4. `useActionState`
React 19's `useActionState` hook connects a Server Action to a form, providing `pending` state for loading indicators and the return value for error/success messages.

## How to Run
```bash
npm run dev
```
Login, then navigate to `/dashboard` to add books via Server Actions.
