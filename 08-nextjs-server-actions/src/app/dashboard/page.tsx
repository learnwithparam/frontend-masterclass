'use client'

import { addBookAction } from '../actions/auth'
import { useActionState } from 'react'

export default function DashboardPage() {
  const [state, formAction, pending] = useActionState(addBookAction, null)

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500">Add books using Server Actions. The JWT is in an httpOnly cookie.</p>
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

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Add a Book</h3>
        <form action={formAction} className="flex flex-col gap-4">
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

        {state?.success && <p className="mt-3 text-sm text-emerald-600 bg-emerald-50 p-2 rounded">&quot;{state.title}&quot; added! The catalog has been revalidated.</p>}
        {state?.error && <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">{state.error}</p>}
      </div>
    </div>
  )
}
