/**
 * Module 05: Declarative UI & Utility Styling
 *
 * This is the same Bookstore — rebuilt with React and Tailwind CSS.
 * Compare this to Module 02's script.js to see the difference between
 * imperative DOM manipulation and declarative component rendering.
 */

import { useState, useEffect } from 'react'

const API_BASE_URL = 'http://localhost:3000/api'

function BookCard({ title, author, pages, published }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg transition-all">
      <div>
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-500">by {author}</p>
      </div>
      <div className="flex gap-2 mt-4 text-xs text-slate-500">
        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{pages} Pages</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">Pub: {published}</span>
      </div>
    </div>
  )
}

function AddBookForm({ onBookAdded }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const fd = new FormData(e.target)
    const payload = {
      title: fd.get('title'),
      author: fd.get('author'),
      pages: parseInt(fd.get('pages'), 10),
      published: fd.get('published'),
    }

    try {
      const res = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      setSuccess(true)
      e.target.reset()
      onBookAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900 mb-1">Add Inventory</h2>
      <p className="text-sm text-slate-500 mb-4">Stock the shelves via the API.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Title</span>
          <input name="title" required className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f01]" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Author</span>
          <input name="author" required className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f01]" />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Pages</span>
            <input name="pages" type="number" min="1" required className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f01]" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Year</span>
            <input name="published" required className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f01]" />
          </label>
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-2.5 bg-[#ff4f01] text-white font-medium rounded-lg hover:bg-[#e64600] disabled:opacity-50 transition-colors">
          {loading ? 'Saving...' : 'Add Book'}
        </button>
      </form>

      {success && <p className="mt-3 text-sm text-emerald-600 bg-emerald-50 p-2 rounded">Book added!</p>}
      {error && <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
    </div>
  )
}

export default function App() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchBooks() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE_URL}/books`)
      if (!res.ok) throw new Error(`Server returned ${res.status}`)
      setBooks(await res.json())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // useEffect runs ONCE after the first render (like DOMContentLoaded)
  useEffect(() => { fetchBooks() }, [])

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-900">📚 BookStore</h1>
          <span className="text-sm text-slate-500">React + Tailwind</span>
        </div>
      </header>

      {/* Layout */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
        {/* Sidebar */}
        <aside>
          <div className="md:sticky md:top-20">
            <AddBookForm onBookAdded={fetchBooks} />
          </div>
        </aside>

        {/* Main */}
        <main>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Live Catalog</h2>

          {loading && (
            <div className="text-center py-8 text-slate-500">
              <div className="w-8 h-8 border-3 border-slate-200 border-t-[#ff4f01] rounded-full animate-spin mx-auto mb-3" />
              <p>Syncing with server...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-center">
              <p>{error}</p>
              <button onClick={fetchBooks} className="mt-2 px-4 py-1 border border-red-200 rounded-lg hover:bg-red-100">Retry</button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {books.length === 0
                ? <p className="text-slate-500 col-span-full text-center">No books yet. Add one!</p>
                : books.map((book, i) => <BookCard key={i} {...book} />)
              }
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
