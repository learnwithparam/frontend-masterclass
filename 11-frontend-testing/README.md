# Module 11: Frontend Testing

> "Code without tests is legacy code the day it's written."

## The Story

A teammate changes the login server action and accidentally renames the token cookie from `token` to `auth_token`. The app looks fine locally — the teammate was still logged in from before the change. Nobody notices until a customer reports "I can't log in" three hours later. You need automated tests.

## What You'll Build

- **Unit tests** with Vitest for pure utility functions
- **Component tests** with React Testing Library for UI components
- **API mocking** with MSW (Mock Service Worker)
- **E2E tests** with Playwright for full user flows
- **Testing patterns** that catch real bugs, not implementation details

## The Testing Pyramid

```
        /\
       /  \        E2E Tests (Playwright)
      / E2E\       Slow, expensive, catch integration bugs
     /------\
    /  Comp  \     Component Tests (RTL)
   /  onent   \   Medium speed, test user interactions
  /------------\
 /    Unit      \  Unit Tests (Vitest)
/________________\ Fast, cheap, test pure logic
```

## Key Concepts

### Test What Users See, Not Implementation
Bad: `expect(component.state.isLoading).toBe(true)`
Good: `expect(screen.getByText('Loading...')).toBeDefined()`

### MSW Mocks at the Network Level
MSW intercepts `fetch` calls — your component code doesn't know it's being tested. This catches bugs that mocking `fetch` directly would miss.

### data-testid for Stable Selectors
CSS classes change. Text changes. `data-testid="book-card"` is a contract between your tests and your markup.

## Prerequisites

- Module 08 (Server Actions) completed
- Docker Desktop running (for backend in smoke tests)

## Your Task

1. Write unit tests for `lib/utils.ts` (formatBookTitle, calculateReadingTime, validateISBN)
2. Write component tests for BookCard, login form, dashboard form
3. Set up MSW handlers for the bookstore API
4. Write a Playwright E2E test for the login flow

## Testing

```bash
make setup     # Install dependencies
make test      # Run unit + component tests (Vitest)
make test-e2e  # Run E2E tests (Playwright)
make smoke     # Run full smoke test suite
```

## Common Mistakes

1. **Testing implementation details** — Don't test state variables or internal methods. Test what the user sees.
2. **Mocking too much** — MSW mocks at the network level. Don't mock React hooks or internal functions.
3. **Brittle selectors** — `div > span:nth-child(3)` breaks when you add a wrapper. Use `data-testid`.
4. **No test isolation** — Each test should set up its own state. Don't depend on test execution order.

## What's Next

Module 12 adds multi-step forms with Zod validation — where testing becomes even more valuable.
