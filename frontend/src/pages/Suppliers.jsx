import { useEffect, useState, useCallback } from 'react'
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../api/api'
import Modal from '../components/Modal'

const empty = { supplierName: '', contactInfo: '' }

export default function Suppliers() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit]           = useState(null)
  const [form, setForm]           = useState(empty)
  const [saving, setSaving]       = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try { const r = await getSuppliers(); setItems(r.data) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd  = () => { setEdit(null); setForm(empty); setShowModal(true) }
  const openEdit = (s) => { setEdit(s); setForm({ supplierName: s.supplierName, contactInfo: s.contactInfo }); setShowModal(true) }
  const handle   = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const save = async () => {
    setSaving(true)
    try {
      if (edit) await updateSupplier(edit.supplierId, form)
      else      await createSupplier(form)
      setShowModal(false); load()
    } catch (e) { alert(e.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this supplier?')) return
    try { await deleteSupplier(id); load() }
    catch (e) { alert('Cannot delete — products may be linked to this supplier.') }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Suppliers</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Supplier
        </button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>#</th><th>Supplier Name</th><th>Contact Info</th><th>Actions</th></tr></thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={4}><div className="empty-state">No suppliers yet. Add one!</div></td></tr>
                ) : items.map((s, i) => (
                  <tr key={s.supplierId}>
                    <td style={{ color: 'var(--text-faint)', fontSize: 'var(--text-xs)' }}>{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{s.supplierName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{s.contactInfo}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(s)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(s.supplierId)}>Delete</button>
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
        <Modal title={edit ? 'Edit Supplier' : 'Add Supplier'} onClose={() => setShowModal(false)} onSubmit={save} loading={saving}>
          <div className="form-group">
            <label className="form-label">Supplier Name *</label>
            <input className="form-input" name="supplierName" value={form.supplierName}
              onChange={handle} placeholder="e.g. TechParts Ltd." required autoFocus />
          </div>
          <div className="form-group">
            <label className="form-label">Contact Info *</label>
            <input className="form-input" name="contactInfo" value={form.contactInfo}
              onChange={handle} placeholder="Phone / Email / Address" required />
          </div>
        </Modal>
      )}
    </div>
  )
}