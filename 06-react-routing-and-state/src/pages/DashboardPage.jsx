import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBooks } from '../hooks/useBooks'

export default function DashboardPage() {
  const { user, token, logout } = useAuth()
  const { refetch } = useBooks()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState(null)

  async function handleAddBook(e) {
    e.preventDefault()
    setLoading(true)
    setMsg(null)

    const fd = new FormData(e.target)
    const payload = {
      title: fd.get('title'),
      author: fd.get('author'),
      pages: parseInt(fd.get('pages'), 10),
      published: fd.get('published'),
    }

    try {
      const res = await fetch('http://localhost:3000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed')

      setMsg({ type: 'success', text: `"${payload.title}" added!` })
      e.target.reset()
      refetch()
    } catch (err) {
      setMsg({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Welcome back, {user?.username}</p>
        </div>
        <button onClick={logout}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50 transition-colors">
          Logout
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Add a Book</h3>
        <form onSubmit={handleAddBook} className="flex flex-col gap-4">
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
            className="w-full py-2.5 bg-[#ff4f01] text-white font-medium rounded-lg hover:bg-[#e64600] disabled:opacity-50">
            {loading ? 'Saving...' : 'Add Book'}
          </button>
        </form>

        {msg && (
          <p className={`mt-3 text-sm p-2 rounded ${msg.type === 'success' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {msg.text}
          </p>
        )}
      </div>
    </div>
  )
}
