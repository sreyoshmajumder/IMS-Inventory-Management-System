import { useEffect, useState } from 'react'
import { getInventoryValueReport, getLowStockReport, getProducts } from '../api/api'

export default function Reports() {
  const [totalValue, setTotalValue]   = useState(null)
  const [lowStock, setLowStock]       = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    Promise.all([getInventoryValueReport(), getLowStockReport(5), getProducts()])
      .then(([v, l, p]) => {
        setTotalValue(v.data)
        setLowStock(l.data)
        setAllProducts(p.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading reports…</div>

  const topByValue = [...allProducts]
    .sort((a, b) => (b.price * b.quantity) - (a.price * a.quantity))
    .slice(0, 10)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Reports</h1>
      </div>

      <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="stat-card">
          <div className="stat-label">Total Inventory Value</div>
          <div className="stat-value" style={{ color: 'var(--primary)', fontSize: 'var(--text-lg)' }}>
            {totalValue != null ? '₹' + Number(totalValue).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '—'}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Stock Items</div>
          <div className="stat-value" style={{ color: 'var(--error)' }}>{lowStock.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total SKUs</div>
          <div className="stat-value">{allProducts.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-6)' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Products by Value</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
              <tbody>
                {topByValue.map(p => (
                  <tr key={p.productId}>
                    <td style={{ fontWeight: 500 }}>{p.productName}</td>
                    <td>{p.quantity}</td>
                    <td>₹{p.price?.toFixed(2)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                      ₹{(p.price * p.quantity).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Low Stock Report</span>
            <span className="badge badge-red">&lt; 5 units</span>
          </div>
          {lowStock.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" style={{ margin: '0 auto var(--space-3)', opacity: 0.3 }}>
                <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
              </svg>
              All products are well-stocked!
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead><tr><th>Product</th><th>Quantity</th><th>Price</th></tr></thead>
                <tbody>
                  {lowStock.map(p => (
                    <tr key={p.productId}>
                      <td style={{ fontWeight: 500 }}>{p.productName}</td>
                      <td><span className="stock-low">{p.quantity}</span></td>
                      <td>₹{p.price?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}