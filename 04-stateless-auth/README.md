# Module 04: Client-Side Security & State (`04-stateless-auth`)

This module integrates directly with the **Authentication** system we built in `backend-masterclass` Module 05. Instead of everyone being able to add books, we now require a login.

## Concepts Covered

### 1. JSON Web Tokens (JWT)
When a user logs in, the backend returns a JWT — a signed token string. The frontend stores it and includes it in future requests to prove identity. The token is *stateless*: the server doesn't keep a session; it simply verifies the signature.

### 2. Web Storage API (`localStorage`)
We use `localStorage.setItem('bookstore_jwt', token)` to persist the JWT across page refreshes. Unlike `sessionStorage`, `localStorage` survives browser restarts — the user stays logged in.

**Security Warning:** Storing JWTs in `localStorage` is acceptable for learning, but production apps often use `httpOnly` cookies to prevent XSS attacks from stealing the token. We'll address this properly in Module 08 (Server Actions).

### 3. The `Authorization: Bearer` Header
When making authenticated API calls (like POST /api/books), we attach the token:
```javascript
headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
}
```
The backend middleware reads this header, verifies the JWT, and either allows or rejects the request.

### 4. Conditional UI Rendering
Based on whether `localStorage` has a token, we show/hide different UI panels:
- **Guest:** Login/Register forms visible, Add Book form hidden.
- **Authenticated:** Login/Register hidden, Add Book form visible + Logout button appears.

This is the *imperative* way to do it. In React (Module 06), we'll use state to make this declarative.

## How to Run
1. Start the backend: `cd backend-masterclass/11-ship-it && make run-prod`
2. Serve this module: `npx serve .`
3. Register a new account, then try adding a book!
