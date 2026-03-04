import { Suspense } from 'react'

const API = process.env.BACKEND_URL || 'http://localhost:3000/api'

async function getBooks() {
  try {
    const res = await fetch(`${API}/books`, { cache: 'no-store' })
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    return await res.json()
  } catch {
    return null
  }
}

function BookGrid({ books }: { books: any[] | null }) {
  if (books === null) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center">
        Could not connect to the backend API.
      </div>
    )
  }
  if (books.length === 0) {
    return <p className="text-slate-500 text-center py-8">No books yet.</p>
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {books.map((book: any, i: number) => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold text-slate-900">{book.title}</h3>
          <p className="text-sm text-slate-500">by {book.author}</p>
          <div className="flex gap-2 mt-4 text-xs text-slate-500">
            <span className="bg-slate-100 px-2 py-0.5 rounded">{book.pages} Pages</span>
            <span className="bg-slate-100 px-2 py-0.5 rounded">Pub: {book.published}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function BookGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
          <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
          <div className="flex gap-2">
            <div className="h-4 bg-slate-200 rounded w-16" />
            <div className="h-4 bg-slate-200 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  )
}

async function AsyncBookGrid() {
  const books = await getBooks()
  return <BookGrid books={books} />
}

export default function CatalogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Book Catalog</h2>
      <p className="text-sm text-slate-500 mb-8">
        This uses <strong>React Suspense + Streaming SSR</strong>. The skeleton loads instantly while the server fetches data.
      </p>

      {/* Suspense boundary: show skeleton while server fetches data */}
      <Suspense fallback={<BookGridSkeleton />}>
        <AsyncBookGrid />
      </Suspense>
    </div>
  )
}
