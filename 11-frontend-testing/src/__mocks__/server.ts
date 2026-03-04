/**
 * MSW (Mock Service Worker) Test Server
 *
 * KEY CONCEPT: MSW intercepts HTTP requests at the network level,
 * so your components make real fetch() calls but get controlled
 * responses. This is better than mocking fetch directly because
 * your code runs exactly as it would in production — only the
 * network layer is faked.
 *
 * - beforeAll: Start intercepting before any test runs
 * - afterEach: Reset to default handlers (isolate tests from each other)
 * - afterAll: Stop intercepting, restore normal network
 */
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
