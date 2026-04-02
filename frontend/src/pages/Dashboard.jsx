import { useEffect, useState } from 'react'
import { getDashboard, getLowStock } from '../api/api'

const StatCard = ({ label, value, icon, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ background: color + '20', color }}>{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value ?? '—'}</div>
  </div>
)

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [lowItems, setLowItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getDashboard(), getLowStock(5)])
      .then(([d, l]) => { setData(d.data); setLowItems(l.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Loading dashboard…</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Overview</h1>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>

      <div className="stats-grid">
        <StatCard
          label="Total Products"
          value={data?.totalProducts}
          color="var(--primary)"
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          }
        />
        <StatCard
          label="Total Suppliers"
          value={data?.totalSuppliers}
          color="var(--success)"
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          }
        />
        <StatCard
          label="Total Orders"
          value={data?.totalOrders}
          color="var(--warning)"
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          }
        />
        <StatCard
          label="Low Stock Items"
          value={data?.lowStockProducts}
          color="var(--error)"
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          }
        />
        <StatCard
          label="Inventory Value"
          value={
            data?.totalInventoryValue != null
              ? '₹' + Number(data.totalInventoryValue).toLocaleString('en-IN', { maximumFractionDigits: 2 })
              : '—'
          }
          color="#7a39bb"
          icon={
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          }
        />
      </div>

      {lowItems.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">⚠️ Low Stock Alert</span>
            <span className="badge badge-red">{lowItems.length} items</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {lowItems.map(p => (
                  <tr key={p.productId}>
                    <td>{p.productName}</td>
                    <td><span className="stock-low">{p.quantity}</span></td>
                    <td>₹{p.price?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {lowItems.length === 0 && data && (
        <div className="card">
          <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
            <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
            </svg>
            <p style={{ marginTop: 'var(--space-3)', fontWeight: 500 }}>All products are well-stocked!</p>
          </div>
        </div>
      )}
    </div>
  )
}