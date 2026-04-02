import { useEffect, useState, useCallback } from 'react'
import { getOrders, createOrder, updateOrder, deleteOrder, getProducts } from '../api/api'
import Modal from '../components/Modal'

const STATUS    = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const badgeMap  = { PENDING: 'badge-orange', PROCESSING: 'badge-blue', SHIPPED: 'badge-blue', DELIVERED: 'badge-green', CANCELLED: 'badge-red' }
const empty     = { productId: '', quantity: '', status: 'PENDING', orderDate: '' }

export default function Orders() {
  const [items, setItems]         = useState([])
  const [products, setProducts]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit]           = useState(null)
  const [form, setForm]           = useState(empty)
  const [saving, setSaving]       = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [o, p] = await Promise.all([getOrders(), getProducts()])
      setItems(o.data); setProducts(p.data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const openAdd = () => {
    setEdit(null)
    setForm({ ...empty, orderDate: new Date().toISOString().slice(0, 16) })
    setShowModal(true)
  }
  const openEdit = (o) => {
    setEdit(o)
    setForm({ productId: o.productId, quantity: o.quantity, status: o.status, orderDate: o.orderDate ? o.orderDate.slice(0, 16) : '' })
    setShowModal(true)
  }
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const save = async () => {
    setSaving(true)
    try {
      const body = {
        productId: Number(form.productId),
        quantity:  Number(form.quantity),
        status:    form.status,
        orderDate: form.orderDate ? form.orderDate + ':00' : null,
      }
      if (edit) await updateOrder(edit.orderId, body)
      else      await createOrder(body)
      setShowModal(false); load()
    } catch (e) { alert(e.response?.data?.message || 'Error saving order') }
    finally { setSaving(false) }
  }

  const remove = async (id) => {
    if (!confirm('Delete this order?')) return
    await deleteOrder(id); load()
  }

  const productName = (id) => products.find(p => p.productId === id)?.productName || `Product #${id}`

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
        <button className="btn btn-primary" onClick={openAdd}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Order
        </button>
      </div>

      <div className="card">
        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Product</th><th>Qty</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr><td colSpan={6}><div className="empty-state">No orders yet</div></td></tr>
                ) : items.map(o => (
                  <tr key={o.orderId}>
                    <td style={{ color: 'var(--text-faint)', fontSize: 'var(--text-xs)', fontWeight: 600 }}>#{o.orderId}</td>
                    <td style={{ fontWeight: 500 }}>{productName(o.productId)}</td>
                    <td>{o.quantity}</td>
                    <td><span className={`badge ${badgeMap[o.status] || 'badge-blue'}`}>{o.status}</span></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                      {o.orderDate ? new Date(o.orderDate).toLocaleDateString('en-IN') : '—'}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(o)}>Edit</button>
                        <button className="btn btn-danger btn-sm" onClick={() => remove(o.orderId)}>Delete</button>
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
        <Modal title={edit ? 'Edit Order' : 'New Order'} onClose={() => setShowModal(false)} onSubmit={save} loading={saving}>
          <div className="form-group">
            <label className="form-label">Product *</label>
            <select className="form-select" name="productId" value={form.productId} onChange={handle} required>
              <option value="">— Select product —</option>
              {products.map(p => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity *</label>
            <input className="form-input" name="quantity" type="number" min="1" value={form.quantity} onChange={handle} placeholder="1" required />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" name="status" value={form.status} onChange={handle}>
              {STATUS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Order Date</label>
            <input className="form-input" name="orderDate" type="datetime-local" value={form.orderDate} onChange={handle} />
          </div>
        </Modal>
      )}
    </div>
  )
}