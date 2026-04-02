import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

const nav = [
  {
    to: '/', label: 'Dashboard',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
  },
  {
    to: '/products', label: 'Products',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
  },
  {
    to: '/categories', label: 'Categories',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 20h16M4 4h16M4 12h16"/></svg>
  },
  {
    to: '/suppliers', label: 'Suppliers',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  },
  {
    to: '/orders', label: 'Orders',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
  },
  {
    to: '/reports', label: 'Reports',
    icon: <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
  },
]

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/categories': 'Categories',
  '/suppliers': 'Suppliers',
  '/orders': 'Orders',
  '/reports': 'Reports',
}

export default function Layout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [dark, setDark] = useState(
    () => window.matchMedia('(prefers-color-scheme: dark)').matches
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

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
          {nav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}
            >
              {icon}
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-pill">
            <div className="user-avatar">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user?.username}</div>
              <div className="user-role">{user?.role || 'User'}</div>
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
          <span className="topbar-title">
            {pageTitles[location.pathname] || 'IMS'}
          </span>
          <div className="topbar-right">
            <button
              className="theme-toggle"
              onClick={() => setDark(d => !d)}
              title="Toggle theme"
            >
              {dark
                ? <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                : <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              }
            </button>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}