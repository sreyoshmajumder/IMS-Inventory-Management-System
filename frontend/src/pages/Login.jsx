import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await login(form)
      signIn(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">IMS</div>
          <div className="auth-title">Welcome back</div>
          <div className="auth-sub">Sign in to your inventory account</div>
        </div>

        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="form-input"
              name="username"
              value={form.username}
              onChange={handle}
              placeholder="Enter your username"
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              name="password"
              value={form.password}
              onChange={handle}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.625rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  )
}