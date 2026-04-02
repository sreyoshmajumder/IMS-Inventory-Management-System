import { useEffect, useState, useCallback } from 'react'
import { getCategories, createCategory, updateCategory, deleteCategory } from '../api/api'
import Modal from '../components/Modal'

const empty = { categoryName: '' }

export default function Categories() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit]           = useState(null)
  const [form, setForm]           = useState(empty)
  const [saving, setSaving]       = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await getCategories(); setItems(r.data) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd  = () => { setEdit(null); setForm(empty); setShowModal(true) }
  const openEdit = (c) => { setEdit(c); setForm({ categoryName: c.categoryName }); setShowModal(true) }
  const handle   = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const save = async () => {
    if (!form.categoryName.trim()) return
    setSaving(true)
    try {
      if (edit) await updateCategory(edit.categoryId, form)
      else      await createCategory(form)
      setShowModal(false); load()
    } catch (e) { alert(e.response?.data?.message || 'Error saving category') }
    finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this category?')) return
    try { await deleteCategory(id); load() }
    catch (e) { alert('Cannot delete — products may be linked to this category.') }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Categories</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Category
        </button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Category Name</th><th>Actions</th></tr></thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={3}><div className="empty-state">No categories yet. Add one!</div></td></tr>
                ) : items.map((c, i) => (
                  <tr key={c.categoryId}>
                    <td style={{ color: 'var(--text-faint)', fontSize: 'var(--text-xs)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{c.categoryName}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(c)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(c.categoryId)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title={edit ? 'Edit Category' : 'Add Category'} onClose={() => setShowModal(false)} onSubmit={save} loading={saving}>
          <div className="form-group">
            <label className="form-label">Category Name *</label>
            <input className="form-input" name="categoryName" value={form.categoryName}
              onChange={handle} placeholder="e.g. Electronics" required autoFocus />
          </div>
        </Modal>
      )}
    </div>
  )
}