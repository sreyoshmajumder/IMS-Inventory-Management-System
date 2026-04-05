import axios from 'axios'

const api = axios.create({
  baseURL: '/api'
})

// Auth
export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)

// Users
export const getUsers = () => api.get('/users')
export const createUser = (data) => api.post('/users', data)
export const updateUserRole = (id, role) => api.put(`/users/${id}/role`, { role })
export const deleteUser = (id) => api.delete(`/users/${id}`)

// Dashboard
export const getDashboard = () => api.get('/dashboard')

// Products
export const getProducts = () => api.get('/products')
export const getProductById = (id) => api.get(`/products/${id}`)
export const createProduct = (data) => api.post('/products', data)
export const updateProduct = (id, data) => api.put(`/products/${id}`, data)
export const deleteProduct = (id) => api.delete(`/products/${id}`)
export const searchProducts = (name) => api.get(`/products/search?name=${name}`)
export const getLowStock = (qty) => api.get(`/products/low-stock?quantity=${qty}`)
export const addStock = (id, qty) => api.put(`/products/${id}/add-stock?quantity=${qty}`)
export const reduceStock = (id, qty) => api.put(`/products/${id}/reduce-stock?quantity=${qty}`)
export const getProductsByPrice = (min, max) => api.get(`/products/price-range?min=${min}&max=${max}`)

// Categories
export const getCategories = () => api.get('/categories')
export const createCategory = (data) => api.post('/categories', data)
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data)
export const deleteCategory = (id) => api.delete(`/categories/${id}`)

// Suppliers
export const getSuppliers = () => api.get('/suppliers')
export const createSupplier = (data) => api.post('/suppliers', data)
export const updateSupplier = (id, data) => api.put(`/suppliers/${id}`, data)
export const deleteSupplier = (id) => api.delete(`/suppliers/${id}`)

// Orders
export const getOrders = () => api.get('/orders')
export const createOrder = (data) => api.post('/orders', data)
export const updateOrder = (id, data) => api.put(`/orders/${id}`, data)
export const deleteOrder = (id) => api.delete(`/orders/${id}`)

// Logs
export const getLogs = () => api.get('/logs')
export const getLogsByProduct = (id) => api.get(`/logs/product/${id}`)

// Reports
export const getInventoryValueReport = () => api.get('/reports/inventory-value')
export const getLowStockReport = (qty = 5) => api.get(`/products/low-stock?quantity=${qty}`)

// Smart Assistant
export const getSmartAlerts = () => api.get('/smart/alerts')
export const getLowStockPredictions = () => api.get('/smart/low-stock-predictions')
export const getDeadStock = () => api.get('/smart/dead-stock')
export const getDemandAnalysis = () => api.get('/smart/demand-analysis')

export default api