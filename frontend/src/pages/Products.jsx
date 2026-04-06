import { useEffect, useState, useCallback } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  addStock,
  reduceStock,
  getCategories,
  getSuppliers
} from '../api/api'
import { useAuth } from '../context/AuthContext'
import Modal from '../components/Modal'

const empty = { productName: '', price: '', quantity: '', category: '', supplier: '' }

export default function Products() {
  const { user } = useAuth()
  const role = String(user?.role || 'USER').replace('ROLE_', '').toUpperCase()
  const isAdmin = role === 'ADMIN'

  const [items, setItems] = useState([])
  const [cats, setCats] = useState([])
  const [sups, setSups] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [edit, setEdit] = useState(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [stockModal, setStockModal] = useState(null)
  const [stockQty, setStockQty] = useState('')
  const [filterLow, setFilterLow] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      if (isAdmin) {
        const [p, c, s] = await Promise.all([getProducts(), getCategories(), getSuppliers()])
        setItems(p.data)
        setCats(c.data)
        setSups(s.data)
      } else {
        const p = await getProducts()
        setItems(p.data)
        setCats([])
        setSups([])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    load()
  }, [load])

  const handleSearch = async (v) => {
    setSearch(v)
    if (v.trim()) {
      const r = await searchProducts(v)
      setItems(r.data)
    } else {
      load()
    }
  }

  const openAdd = () => {
    if (!isAdmin) return
    setEdit(null)
    setForm(empty)
    setShowModal(true)
  }

  const openEdit = (p) => {
    if (!isAdmin) return
    setEdit(p)
    setForm({
      productName: p.productName,
      price: p.price,
      quantity: p.quantity,
      category: p.categoryId || '',
      supplier: p.supplierId || ''
    })
    setShowModal(true)
  }

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const save = async () => {
    if (!isAdmin) return
    setSaving(true)
    try {
      const body = {
        productName: form.productName,
        price: Number(form.price),
        quantity: Number(form.quantity),
        ...(form.category ? { category: { categoryId: Number(form.category) } } : {}),
        ...(form.supplier ? { supplier: { supplierId: Number(form.supplier) } } : {}),
      }

      if (edit) await updateProduct(edit.productId, body)
      else await createProduct(body)

      setShowModal(false)
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Error saving product')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (id) => {
    if (!isAdmin) return
    if (!confirm('Delete this product?')) return
    await deleteProduct(id)
    load()
  }

  const doStock = async () => {
    if (!isAdmin) return
    if (!stockQty || isNaN(stockQty)) return

    try {
      if (stockModal.mode === 'add') {
        await addStock(stockModal.product.productId, Number(stockQty))
      } else {
        await reduceStock(stockModal.product.productId, Number(stockQty))
      }
      setStockModal(null)
      setStockQty('')
      load()
    } catch (e) {
      alert(e.response?.data?.message || 'Stock update failed')
    }
  }

  const displayed = filterLow ? items.filter(p => p.quantity < 5) : items

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Products</h1>
        <div className="action-row">
          <div className="search-bar">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              className="search-input"
              placeholder="Search products…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
          </div>

          <button
            className={`btn btn-ghost btn-sm ${filterLow ? 'btn-danger' : ''}`}
            onClick={() => setFilterLow(v => !v)}
          >
            {filterLow ? '✕ Low Stock' : '⚠ Low Stock'}
          </button>

          {isAdmin && (
            <button className="btn btn-primary" onClick={openAdd}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Product
            </button>
          )}
        </div>
      </div>

      <div className="card">
        {!isAdmin && (
          <div style={{ marginBottom: 'var(--space-4)', color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
            View-only access: Staff/Users can browse, search, and filter products.
          </div>
        )}

        {loading ? (
          <div className="loading">Loading…</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>{isAdmin ? 'Actions' : 'Access'}</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr>
                    <td colSpan={5}>
                      <div className="empty-state">
                        <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                        </svg>
                        No products found
                      </div>
                    </td>
                  </tr>
                ) : (
                  displayed.map((p, i) => (
                    <tr key={p.productId}>
                      <td style={{ color: 'var(--text-faint)', fontSize: 'var(--text-xs)' }}>{i + 1}</td>
                      <td style={{ fontWeight: 500 }}>{p.productName}</td>
                      <td>₹{p.price?.toFixed(2)}</td>
                      <td>
                        <span className={p.quantity < 5 ? 'stock-low' : 'stock-ok'}>{p.quantity}</span>
                        {p.quantity < 5 && <span className="badge badge-red" style={{ marginLeft: 6 }}>Low</span>}
                      </td>
                      <td>
                        {isAdmin ? (
                          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                            <button className="btn btn-ghost btn-sm" onClick={() => setStockModal({ product: p, mode: 'add' })}>+ Stock</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => setStockModal({ product: p, mode: 'reduce' })}>- Stock</button>
                            <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}>Edit</button>
                            <button className="btn btn-danger btn-sm" onClick={() => remove(p.productId)}>Delete</button>
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>View only</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAdmin && showModal && (
        <Modal
          title={edit ? 'Edit Product' : 'Add Product'}
          onClose={() => setShowModal(false)}
          onSubmit={save}
          loading={saving}
        >
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" name="productName" value={form.productName} onChange={handle} placeholder="e.g. Wireless Mouse" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="form-group">
              <label className="form-label">Price (₹) *</label>
              <input className="form-input" name="price" type="number" min="0.01" step="0.01" value={form.price} onChange={handle} placeholder="0.00" required />
            </div>
            <div className="form-group">
              <label className="form-label">Quantity *</label>
              <input className="form-input" name="quantity" type="number" min="0" value={form.quantity} onChange={handle} placeholder="0" required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" name="category" value={form.category} onChange={handle}>
              <option value="">— Select category —</option>
              {cats.map(c => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Supplier</label>
            <select className="form-select" name="supplier" value={form.supplier} onChange={handle}>
              <option value="">— Select supplier —</option>
              {sups.map(s => <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {isAdmin && stockModal && (
        <Modal
          title={`${stockModal.mode === 'add' ? 'Add' : 'Reduce'} Stock — ${stockModal.product.productName}`}
          onClose={() => { setStockModal(null); setStockQty('') }}
          onSubmit={doStock}
          submitLabel={stockModal.mode === 'add' ? 'Add Stock' : 'Reduce Stock'}
        >
          <div className="form-group">
            <label className="form-label">Quantity to {stockModal.mode === 'add' ? 'add' : 'reduce'}</label>
            <input className="form-input" type="number" min="1" value={stockQty} onChange={e => setStockQty(e.target.value)} placeholder="Enter quantity" autoFocus />
          </div>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            Current stock: <strong>{stockModal.product.quantity}</strong>
          </p>
        </Modal>
      )}
    </div>
  )
}