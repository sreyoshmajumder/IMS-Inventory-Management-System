import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Suppliers from './pages/Suppliers'
import Orders from './pages/Orders'
import Reports from './pages/Reports'
import Users from './pages/Users'
import Logs from './pages/Logs'
import SmartAssistant from './pages/SmartAssistant'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin()) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      <Route path="/login"    element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index               element={<Dashboard />} />
        <Route path="products"    element={<Products />} />
        <Route path="categories"  element={<Categories />} />
        <Route path="suppliers"   element={<Suppliers />} />
        <Route path="orders"      element={<Orders />} />
        <Route path="reports"     element={<Reports />} />
        <Route path="smart"       element={<SmartAssistant />} />
        {/* Admin Only */}
        <Route path="users"  element={<AdminRoute><Users /></AdminRoute>} />
        <Route path="logs"   element={<AdminRoute><Logs /></AdminRoute>} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}