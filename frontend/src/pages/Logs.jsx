import { useEffect, useState } from 'react'
import { getLogs } from '../api/api'

const actionBadge = (action) => {
  if (!action) return 'badge-blue'
  const a = action.toUpperCase()
  if (a.includes('DELETE') || a.includes('REMOVE')) return 'badge-red'
  if (a.includes('ADD') || a.includes('CREATE')) return 'badge-green'
  if (a.includes('UPDATE') || a.includes('REDUCE')) return 'badge-orange'
  return 'badge-blue'
}

export default function Logs() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    getLogs()
      .then(r => setLogs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = logs
    .filter(l => !String(l.action || '').toUpperCase().startsWith('ORDER'))
    .filter(l => !search || JSON.stringify(l).toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Audit Logs</h1>
        <div className="search-bar">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="search-input"
            placeholder="Search logs…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="loading">Loading logs…</div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Action</th>
                  <th>Product ID</th>
                  <th>Old Qty</th>
                  <th>New Qty</th>
                  <th>User</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7}><div className="empty-state">No logs found</div></td></tr>
                ) : filtered.map((l, i) => (
                  <tr key={l.id || i}>
                    <td style={{ color: 'var(--text-faint)', fontSize: 'var(--text-xs)' }}>{i + 1}</td>
                    <td><span className={`badge ${actionBadge(l.action)}`}>{l.action}</span></td>
                    <td>#{l.productId}</td>
                    <td style={{ color: 'var(--error)' }}>{l.oldQuantity ?? '—'}</td>
                    <td style={{ color: 'var(--success)' }}>{l.newQuantity ?? '—'}</td>
                    <td style={{ fontWeight: 500 }}>{l.username || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                      {l.timestamp ? new Date(l.timestamp).toLocaleString('en-IN') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}