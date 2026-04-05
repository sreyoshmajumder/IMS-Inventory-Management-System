import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

export default function Layout() {
  const { user, signOut, isAdmin } = useAuth()
  const location = useLocation()
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  const pageTitles = {
    '/': 'Dashboard', '/products': 'Products', '/categories': 'Categories',
    '/suppliers': 'Suppliers', '/orders': 'Orders', '/reports': 'Reports',
    '/users': 'User Management', '/logs': 'Audit Logs', '/smart': 'Smart Assistant'
  }

  const navLinks = [
    { to: '/', label: 'Dashboard', end: true, icon: '📊' },
    { to: '/products',   label: 'Products',   icon: '📦' },
    { to: '/categories', label: 'Categories', icon: '🗂️' },
    { to: '/suppliers',  label: 'Suppliers',  icon: '🚚' },
    { to: '/orders',     label: 'Orders',     icon: '🛒' },
    { to: '/reports',    label: 'Reports',    icon: '📈' },
    { to: '/smart',      label: 'Smart AI',   icon: '🧠' },
  ]

  const adminLinks = [
    { to: '/users', label: 'Users',      icon: '👥' },
    { to: '/logs',  label: 'Audit Logs', icon: '📜' },
  ]

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">IMS</div>
          <div>
            <div className="sidebar-logo-text">Inventory</div>
            <div className="sidebar-logo-sub">Management System</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-label">Main</span>
          {navLinks.map(({ to, label, icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              <span>{icon}</span>{label}
            </NavLink>
          ))}

          {isAdmin() && (
            <>
              <span className="nav-label" style={{ marginTop: 'var(--space-4)' }}>Admin</span>
              {adminLinks.map(({ to, label, icon }) => (
                <NavLink key={to} to={to}
                  className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
                  <span>{icon}</span>{label}
                </NavLink>
              ))}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
            <div className="user-info">
              <div className="user-name">{user?.username}</div>
              <div className="user-role">{user?.role || 'USER'}</div>
            </div>
            <button className="logout-btn" onClick={signOut} title="Logout">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <span className="topbar-title">{pageTitles[location.pathname] || 'IMS'}</span>
          <div className="topbar-right">
            {isAdmin() && (
              <span className="badge badge-blue" style={{ marginRight: 'var(--space-3)' }}>Admin</span>
            )}
            <button className="theme-toggle" onClick={() => setDark(d => !d)} title="Toggle theme">
              {dark
                ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
      </div>
    </div>
  )
}