'use client'

import { loginAction } from '../actions/auth'
import { useActionState } from 'react'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null)

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h2>
        <p className="text-sm text-slate-500 mb-6">
          This form uses a <strong>Server Action</strong>. Your JWT is stored in an httpOnly cookie — JavaScript can never access it.
        </p>

        <form action={formAction} className="flex flex-col gap-4">
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
          <button type="submit" disabled={pending}
            className="w-full py-2.5 bg-[#ff4f01] text-white font-medium rounded-lg hover:bg-[#e64600] disabled:opacity-50 transition-colors">
            {pending ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {state?.error && <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">{state.error}</p>}
      </div>
    </div>
  )
}
