/**
 * AuthContext — Global Authentication State
 *
 * This replaces the per-component localStorage checks from Module 04.
 * Any component in the tree can read `user` and call `login`/`logout`
 * without prop-drilling.
 */
import { createContext, useContext, useState, useEffect } from 'react'

const API = 'http://localhost:3000/api'
const TOKEN_KEY = 'bookstore_jwt'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(null)

  // Sync token to localStorage whenever it changes
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
      // Decode the JWT payload (middle segment) to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ username: payload.username, role: payload.role })
      } catch {
        setUser({ username: 'user' })
      }
    } else {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
    }
  }, [token])

  async function login(username, password) {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    setToken(data.token)
  }

  async function register(username, password) {
    const regRes = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    const regData = await regRes.json()
    if (!regRes.ok) throw new Error(regData.error || 'Registration failed')

    // Backend register returns user object (no token), so auto-login
    await login(username, password)
  }

  function logout() {
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
