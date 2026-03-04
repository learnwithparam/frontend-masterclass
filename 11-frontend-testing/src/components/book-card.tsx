interface BookCardProps {
  title: string;
  author: string;
  pages: number;
  published: string;
}

export function BookCard({ title, author, pages, published }: BookCardProps) {
  return (
    <div className="border rounded-lg p-4 shadow-sm" data-testid="book-card">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-600">by {author}</p>
      <p className="text-sm text-gray-500">{pages} pages | Published: {published}</p>
    </div>
  );
}
