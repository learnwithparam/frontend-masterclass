/**
 * MSW Request Handlers — Define fake API responses
 *
 * KEY CONCEPT: Each handler matches a specific HTTP method + URL.
 * When a test makes a fetch() to that URL, MSW returns YOUR response
 * instead of hitting the real server. This makes tests fast, offline,
 * and deterministic.
 */
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('http://localhost:3000/api/books', () => {
    return HttpResponse.json([
      { id: 1, title: 'Test Book 1', author: 'Author 1', pages: 200, published: '2024' },
      { id: 2, title: 'Test Book 2', author: 'Author 2', pages: 300, published: '2023' },
    ]);
  }),

  http.post('http://localhost:3000/api/auth/login', async ({ request }) => {
    const body = await request.json() as any;
    if (body.username === 'testuser' && body.password === 'password123') {
      return HttpResponse.json({
        token: 'mock-jwt-token',
        user: { id: 1, username: 'testuser', role: 'customer' },
      });
    }
    return HttpResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }),
];
