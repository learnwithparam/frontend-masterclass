'use client';

/**
 * Client-Side Catalog with Live Stock Updates
 *
 * This component hydrates the server-rendered book list and connects
 * to the WebSocket for live stock updates. The token comes from a
 * cookie (set during login).
 */
import { useEffect, useState } from 'react';
import { ConnectionStatus } from '@/components/connection-status';
import { LiveStockBadge } from '@/components/live-stock-badge';
import { useLiveStock } from '@/hooks/use-live-stock';

interface Book {
  id: number;
  title: string;
  author: string;
  pages: number;
  published: string;
}

interface CatalogProps {
  initialBooks: Book[];
}

export function CatalogWithLiveStock({ initialBooks }: CatalogProps) {
  const [token, setToken] = useState<string | null>(null);

  // Read token from cookie (client-side only)
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)token=([^;]*)/);
    if (match) setToken(match[1]);
  }, []);

  const { stock, status } = useLiveStock(token);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500">{initialBooks.length} books</p>
        <ConnectionStatus status={status} />
      </div>

      {initialBooks.length === 0 ? (
        <p className="text-gray-500">No books yet. Add some from the dashboard.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {initialBooks.map((book) => (
            <div key={book.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <h2 className="text-lg font-bold">{book.title}</h2>
                <LiveStockBadge stock={stock[book.id]} />
              </div>
              <p className="text-gray-600">by {book.author}</p>
              <p className="text-sm text-gray-500">{book.pages} pages | Published: {book.published}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
