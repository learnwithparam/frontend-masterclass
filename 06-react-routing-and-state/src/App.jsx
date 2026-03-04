/**
 * Module 06: Advanced Client Architecture
 *
 * React Router for pages. AuthContext for global state. Custom hooks for data.
 */
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import CatalogPage from './pages/CatalogPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'

function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-slate-900">📚 BookStore</Link>
          <nav className="flex gap-4 text-sm">
            <Link to="/" className="text-slate-600 hover:text-[#ff4f01]">Catalog</Link>
            {user && <Link to="/dashboard" className="text-slate-600 hover:text-[#ff4f01]">Dashboard</Link>}
          </nav>
        </div>
        <div>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-500">{user.username}</span>
              <button onClick={logout} className="text-sm px-3 py-1 border border-slate-200 rounded-lg hover:bg-[#fafafa]">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="text-sm px-4 py-2 bg-[#ff4f01] text-white rounded-lg hover:bg-[#e64600]">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}

// Protected Route wrapper — redirects to /login if not authenticated
function RequireAuth({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#fafafa]">
          <Navbar />
          <main className="max-w-6xl mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={
                <RequireAuth><DashboardPage /></RequireAuth>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
