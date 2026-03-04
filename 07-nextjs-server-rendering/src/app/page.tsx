/**
 * Module 07: Server-Rendered Catalog Page
 *
 * THIS IS A SERVER COMPONENT (the default in Next.js App Router).
 * The fetch() happens on the SERVER, not the browser.
 * The HTML is fully rendered before it reaches the client.
 * No useState, no useEffect, no loading spinners needed.
 */

const API = process.env.BACKEND_URL || 'http://localhost:3000/api'

async function getBooks() {
  try {
    const res = await fetch(`${API}/books`, { cache: 'no-store' }) // Always fresh
    if (!res.ok) throw new Error(`API returned ${res.status}`)
    return await res.json()
  } catch {
    return null // Will render error state
  }
}

export default async function CatalogPage() {
  const books = await getBooks()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Book Catalog</h2>
      <p className="text-sm text-slate-500 mb-8">
        This page is <strong>Server-Side Rendered</strong>. View Page Source to see the books are already in the HTML!
      </p>

      {books === null ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center">
          <p>Could not connect to the backend API. Is it running on localhost:3000?</p>
        </div>
      ) : books.length === 0 ? (
        <p className="text-slate-500 text-center py-8">No books in the catalog yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book, i) => (
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
      )}
    </div>
  )
}
