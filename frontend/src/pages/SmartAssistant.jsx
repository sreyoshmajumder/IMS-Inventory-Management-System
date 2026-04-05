import { useEffect, useState } from 'react'
import { getSmartAlerts, getLowStockPredictions, getDeadStock, getDemandAnalysis } from '../api/api'

const urgencyColor = { CRITICAL: 'var(--error)', HIGH: 'var(--warning)', MEDIUM: 'var(--primary)' }
const urgencyBadge = { CRITICAL: 'badge-red', HIGH: 'badge-orange', MEDIUM: 'badge-blue' }
const demandBadge  = { HIGH: 'badge-red', MEDIUM: 'badge-orange', LOW: 'badge-green' }

export default function SmartAssistant() {
  const [alerts, setAlerts]         = useState(null)
  const [predictions, setPredictions] = useState([])
  const [deadStock, setDeadStock]   = useState([])
  const [demand, setDemand]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [tab, setTab]               = useState('predictions')

  useEffect(() => {
    Promise.all([getSmartAlerts(), getLowStockPredictions(), getDeadStock(), getDemandAnalysis()])
      .then(([a, p, d, dm]) => {
        setAlerts(a.data)
        setPredictions(p.data)
        setDeadStock(d.data)
        setDemand(dm.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="loading">Analyzing inventory data…</div>

  const tabs = [
    { id: 'predictions', label: '⚠️ Stock Predictions' },
    { id: 'dead',        label: '💀 Dead Stock' },
    { id: 'demand',      label: '📈 Demand Analysis' },
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🧠 Smart Inventory Assistant</h1>
        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>AI-powered inventory insights</span>
      </div>

      {/* Alert Summary Cards */}
      {alerts && (
        <div className="stats-grid" style={{ marginBottom: 'var(--space-8)' }}>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--error)' }}>
            <div className="stat-label">🚨 Critical Stock</div>
            <div className="stat-value" style={{ color: 'var(--error)' }}>{alerts.criticalStockCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--warning)' }}>
            <div className="stat-label">⚠️ Low Stock</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{alerts.lowStockCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--text-muted)' }}>
            <div className="stat-label">💀 Dead Stock Items</div>
            <div className="stat-value" style={{ color: 'var(--text-muted)' }}>{alerts.deadStockCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeft: '3px solid var(--primary)' }}>
            <div className="stat-label">💰 Inventory Value</div>
            <div className="stat-value" style={{ color: 'var(--primary)', fontSize: 'var(--text-base)' }}>
              ₹{Number(alerts.totalInventoryValue).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-6)' }}>
        {tabs.map(t => (
          <button key={t.id}
            className={`btn ${tab === t.id ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Predictions Tab */}
      {tab === 'predictions' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Low Stock Predictions & Reorder Suggestions</span>
            <span className="badge badge-orange">{predictions.length} items need attention</span>
          </div>
          {predictions.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
              <p>✅ All products have healthy stock levels!</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Product</th><th>Current Stock</th><th>Urgency</th><th>Avg Order Qty</th><th>Reorder Suggestion</th><th>Days Until Stockout</th></tr>
                </thead>
                <tbody>
                  {predictions.map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{p.productName}</td>
                      <td>
                        <span style={{ fontWeight: 700, color: urgencyColor[p.urgency] }}>{p.currentStock}</span>
                      </td>
                      <td><span className={`badge ${urgencyBadge[p.urgency]}`}>{p.urgency}</span></td>
                      <td>{p.avgOrderQty}</td>
                      <td>
                        <span style={{ fontWeight: 600, color: 'var(--primary)' }}>
                          Order {p.reorderSuggestion} units
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>
                        {p.daysUntilStockout === 'N/A' ? 'N/A' : `~${p.daysUntilStockout} days`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Dead Stock Tab */}
      {tab === 'dead' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Dead Stock Detection</span>
            <span className="badge badge-red">{deadStock.length} products never ordered</span>
          </div>
          {deadStock.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
              <p>✅ No dead stock detected!</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Product</th><th>Stock</th><th>Price</th><th>Tied-up Value</th><th>Recommendation</th></tr>
                </thead>
                <tbody>
                  {deadStock.map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{p.productName}</td>
                      <td>{p.currentStock}</td>
                      <td>₹{p.price?.toFixed(2)}</td>
                      <td style={{ fontWeight: 600, color: 'var(--error)' }}>
                        ₹{Number(p.totalValue).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>{p.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Demand Analysis Tab */}
      {tab === 'demand' && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Product Demand Analysis</span>
          </div>
          {demand.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-10)' }}>
              <p>No order data available yet for analysis.</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Product</th><th>Total Orders</th><th>Total Units Ordered</th><th>Current Stock</th><th>Demand Level</th></tr>
                </thead>
                <tbody>
                  {demand.map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{p.productName}</td>
                      <td>{p.totalOrders}</td>
                      <td style={{ fontWeight: 600 }}>{p.totalQuantityOrdered}</td>
                      <td>{p.currentStock}</td>
                      <td><span className={`badge ${demandBadge[p.demandLevel]}`}>{p.demandLevel}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}