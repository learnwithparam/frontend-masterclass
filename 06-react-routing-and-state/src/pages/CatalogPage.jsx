import { useBooks } from '../hooks/useBooks'

export default function CatalogPage() {
  const { books, loading, error, refetch } = useBooks()

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Book Catalog</h2>

      {loading && (
        <div className="text-center py-12 text-slate-500">
          <div className="w-8 h-8 border-3 border-slate-200 border-t-[#ff4f01] rounded-full animate-spin mx-auto mb-3" />
          Loading...
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center">
          <p>{error}</p>
          <button onClick={refetch} className="mt-2 px-4 py-1 border border-red-200 rounded-lg hover:bg-red-100">Retry</button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.length === 0
            ? <p className="col-span-full text-center text-slate-500">No books yet.</p>
            : books.map((book, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold text-slate-900">{book.title}</h3>
                <p className="text-sm text-slate-500">by {book.author}</p>
                <div className="flex gap-2 mt-4 text-xs text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded">{book.pages} Pages</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded">Pub: {book.published}</span>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  )
}
