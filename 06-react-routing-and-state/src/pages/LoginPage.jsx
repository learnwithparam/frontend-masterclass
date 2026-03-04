import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [isRegistering, setIsRegistering] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.target)
    try {
      if (isRegistering) {
        await register(fd.get('username'), fd.get('password'))
      } else {
        await login(fd.get('username'), fd.get('password'))
      }
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {isRegistering ? 'Create Account' : 'Sign In'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Username</span>
            <input name="username" type="text" minLength={3} required className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f01]" />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input name="password" type="password" minLength={6} required className="mt-1 block w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4f01]" />
          </label>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-[#ff4f01] text-white font-medium rounded-lg hover:bg-[#e64600] disabled:opacity-50 transition-colors">
            {loading ? 'Please wait...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        {error && <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}

        <p className="text-sm text-slate-500 mt-4 text-center">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={() => setIsRegistering(!isRegistering)} className="text-[#ff4f01] font-medium hover:underline">
            {isRegistering ? 'Sign In' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
}
