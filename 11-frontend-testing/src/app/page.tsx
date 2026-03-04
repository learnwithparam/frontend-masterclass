import { BookCard } from '@/components/book-card';

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
      {books.length === 0 ? (
        <p className="text-gray-500">No books yet. Add some from the dashboard.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {books.map((book: any) => (
            <BookCard key={book.id} {...book} />
          ))}
        </div>
      )}
    </div>
  );
}
