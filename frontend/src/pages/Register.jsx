import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', role: 'USER' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(form)
      setSuccess('Account created successfully! Redirecting to login…')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      if (!err.response) {
        // Network error — backend not running
        setError('❌ Cannot connect to server. Make sure Spring Boot is running on port 8080.')
      } else {
        const msg = err.response?.data?.message
          || err.response?.data
          || `Server error ${err.response.status}`
        setError(typeof msg === 'string' ? msg : JSON.stringify(msg))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">IMS</div>
          <div className="auth-title">Create account</div>
          <div className="auth-sub">Register to manage your inventory</div>
        </div>

        {error   && <div className="alert alert-error"   style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}
        {success && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{success}</div>}

        <form className="auth-form" onSubmit={submit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <input
              id="username"
              className="form-input"
              name="username"
              value={form.username}
              onChange={handle}
              placeholder="Choose a username"
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
              placeholder="Choose a strong password"
              required
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">Role</label>
            <select
              id="role"
              className="form-select"
              name="role"
              value={form.role}
              onChange={handle}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.625rem' }}
            disabled={loading || !!success}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  )
}