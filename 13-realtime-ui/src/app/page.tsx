/**
 * Home Page — Hybrid SSR + WebSocket
 *
 * KEY CONCEPT: The initial book list comes from the server (SSR).
 * After hydration, the client connects via WebSocket and receives
 * live stock updates. This gives you fast first load + real-time updates.
 */
import { CatalogWithLiveStock } from './catalog-client';

async function getBooks() {
  const res = await fetch('http://localhost:3000/api/books', { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const books = await getBooks();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Book Catalog</h1>
      <CatalogWithLiveStock initialBooks={books} />
    </div>
  );
}
