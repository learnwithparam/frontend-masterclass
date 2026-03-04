'use client'

import { useOptimistic, useActionState } from 'react'
import { addBookAction } from '../actions/auth'

export default function DashboardPage() {
  const [state, formAction, pending] = useActionState(addBookAction, null)
  const [optimisticBooks, addOptimistic] = useOptimistic<any[]>(
    [],
    (current, newBook) => [...current, newBook]
  )

  async function handleAction(formData: FormData) {
    // 1. Instantly update the UI (optimistic)
    addOptimistic({
      title: formData.get('title'),
      author: formData.get('author'),
      pages: formData.get('pages'),
      published: formData.get('published'),
      _optimistic: true,
    })

    // 2. Then send to server
    await formAction(formData)
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Add books with Optimistic UI — updates appear instantly!</p>
        </div>
        <form action={async () => {
          'use server'
          const { logoutAction } = await import('../actions/auth')
          await logoutAction()
        }}>
          <button type="submit" className="px-4 py-2 border border-slate-200 rounded-lg text-sm hover:bg-slate-50">
            Logout
          </button>
        </form>
      </div>

      {/* Optimistic preview */}
      {optimisticBooks.length > 0 && (
        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wide">Adding...</h3>
          {optimisticBooks.map((book, i) => (
            <div key={i} className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-3 animate-pulse">
              <div className="w-2 h-2 bg-[#ff4f01] rounded-full" />
              <span className="text-[#e64600] font-medium">{book.title}</span>
              <span className="text-sm text-[#ff4f01]">by {book.author}</span>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Add a Book</h3>
        <form action={handleAction} className="flex flex-col gap-4">
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
          <button type="submit" disabled={pending}
            className="w-full py-2.5 bg-[#ff4f01] text-white font-medium rounded-lg hover:bg-[#e64600] disabled:opacity-50">
            {pending ? 'Saving...' : 'Add Book'}
          </button>
        </form>

        {state?.success && <p className="mt-3 text-sm text-emerald-600 bg-emerald-50 p-2 rounded">&quot;{state.title}&quot; added!</p>}
        {state?.error && <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">{state.error}</p>}
      </div>
    </div>
  )
}
