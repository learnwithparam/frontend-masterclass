async function getBooks() {
  const res = await fetch('http://localhost:3000/api/books', { cache: 'no-store' });
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json) ? json : json.data ?? [];
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
            <div key={book.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-bold">{book.title}</h2>
              <p className="text-gray-600">by {book.author}</p>
              <p className="text-sm text-gray-500">{book.pages} pages | Published: {book.published}</p>
              {book.coverUrl && (
                <img src={`http://localhost:3000${book.coverUrl}`} alt={book.title} className="mt-2 w-full h-48 object-cover rounded" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
