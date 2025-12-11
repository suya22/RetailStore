"use client"

import { useState } from "react"
import { useNavigate, Navigate, Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { SpinnerIcon, StoreIcon } from "../../components/Icons"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await login(email, password)
      navigate("/admin/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">RetailHub Admin</h1>
          <p className="text-slate-400">Sign in to access the admin portal</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="admin@retail.com"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? (
                <>
                  <SpinnerIcon className="w-5 h-5" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
            <p>Default credentials:</p>
            <p className="font-mono text-gray-700 mt-1">admin@retail.com / admin123</p>
          </div>

          <Link
            to="/"
            className="flex items-center justify-center gap-2 mt-4 text-primary-600 hover:text-primary-700 text-sm font-medium"
          >
            <StoreIcon className="w-4 h-4" />
            Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
