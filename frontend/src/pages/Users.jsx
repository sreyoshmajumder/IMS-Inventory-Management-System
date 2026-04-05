import { useEffect, useState, useCallback } from 'react'
import { getUsers, createUser, updateUserRole, deleteUser } from '../api/api'
import Modal from '../components/Modal'

const ROLES = ['ADMIN', 'STAFF', 'USER']
const empty = { username: '', password: '', role: 'USER' }

export default function Users() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm]           = useState(empty)
  const [saving, setSaving]       = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await getUsers(); setItems(r.data) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const save = async () => {
    setSaving(true)
    try { await createUser(form); setShowModal(false); setForm(empty); load() }
    catch (e) { alert(e.response?.data?.message || 'Error creating user') }
    finally { setSaving(false) }
  }

  const changeRole = async (id, role) => {
    try { await updateUserRole(id, role); load() }
    catch (e) { alert('Error updating role') }
  }

  const remove = async (id) => {
    if (!confirm('Delete this user?')) return
    try { await deleteUser(id); load() }
    catch (e) { alert('Cannot delete user') }
  }

  const roleBadge = (role) => {
    if (role?.includes('ADMIN')) return 'badge-red'
    if (role?.includes('STAFF')) return 'badge-blue'
    return 'badge-green'
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">User Management</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add User
        </button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading users…</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>#</th><th>Username</th><th>Role</th><th>Change Role</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={5}><div className="empty-state">No users found</div></td></tr>
                ) : items.map((u, i) => (
                  <tr key={u.id || u.userId || i}>
                    <td style={{ color: 'var(--text-faint)', fontSize: 'var(--text-xs)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{u.username}</td>
                    <td><span className={`badge ${roleBadge(u.role)}`}>{u.role}</span></td>
                    <td>
                      <select className="form-select" style={{ padding: '4px 8px', fontSize: 'var(--text-xs)' }}
                        value={u.role} onChange={e => changeRole(u.id || u.userId, e.target.value)}>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => remove(u.id || u.userId)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Add New User" onClose={() => setShowModal(false)} onSubmit={save} loading={saving}>
          <div className="form-group">
            <label className="form-label">Username *</label>
            <input className="form-input" name="username" value={form.username} onChange={handle} placeholder="Enter username" required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Password *</label>
            <input className="form-input" type="password" name="password" value={form.password} onChange={handle} placeholder="Enter password" required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-select" name="role" value={form.role} onChange={handle}>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </Modal>
      )}
    </div>
  )
}