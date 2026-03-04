# Module 06: Advanced Client Architecture (`06-react-routing-and-state`)

We've gone from a single HTML page with vanilla JS to a full React SPA (Single Page Application). This module introduces the architectural patterns used in every production React app.

## Concepts Covered

### 1. Client-Side Routing (`react-router-dom`)
Instead of separate HTML files, React Router swaps components in and out when the URL changes — *without a full page reload*. Routes are declared declaratively:
```jsx
<Routes>
  <Route path="/" element={<CatalogPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
</Routes>
```

### 2. Global State with Context API
In Module 04, each component managed auth state independently via `localStorage`. Now we have `AuthContext` — a single source of truth wrapping the entire app. Any nested component can call `useAuth()` to read the user or trigger `login()`/`logout()`.

### 3. Protected Routes
`<RequireAuth>` is a wrapper component. If there's no authenticated user, it redirects to `/login` using `<Navigate>`. This is the standard React pattern for route guarding.

### 4. Custom Hooks (`useBooks`)
We extracted the fetch logic into `useBooks()`. Any page — Catalog, Dashboard, or a future Admin page — can call `useBooks()` and get `{ books, loading, error, refetch }` without duplicating code.

### 5. Error Boundaries
React Error Boundaries catch rendering crashes. Combined with `try/catch` in async functions, this creates a robust error recovery system essential for production apps.

## File Structure
```
src/
├── context/AuthContext.jsx   — Global auth state (login, register, logout)
├── hooks/useBooks.js         — Reusable data fetching hook
├── pages/
│   ├── CatalogPage.jsx       — Public: shows all books
│   ├── LoginPage.jsx         — Auth: login/register form
│   └── DashboardPage.jsx     — Protected: add books (requires auth)
└── App.jsx                   — Router + Navbar + Layout
```

## How to Run
```bash
npm run dev
```
Navigate between `/`, `/login`, and `/dashboard` to see routing in action.
