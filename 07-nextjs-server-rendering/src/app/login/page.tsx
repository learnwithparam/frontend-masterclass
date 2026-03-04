'use client' // This page needs interactivity (forms), so it's a Client Component

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: fd.get('username'),
          password: fd.get('password'),
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')

      // In a real app, we'd set an httpOnly cookie via a Server Action (Module 08!)
      // For now, we store in localStorage like Module 04
      localStorage.setItem('bookstore_jwt', data.token)
      router.push('/')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h2>
        <p className="text-sm text-slate-500 mb-6">
          Note: This page uses <code className="bg-slate-100 px-1 rounded">&apos;use client&apos;</code> because it needs form interactivity.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input name="username" type="text" required
              className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f01]" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input name="password" type="password" required
              className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f01]" />
          </label>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-[#ff4f01] text-white font-medium rounded-lg hover:bg-[#e64600] disabled:opacity-50 transition-colors">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
      </div>
    </div>
  )
}
