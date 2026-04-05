import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ims_user'))
    } catch {
      return null
    }
  })

  const signIn = (userData) => {
    localStorage.setItem('ims_user', JSON.stringify(userData))
    setUser(userData)
  }

  const signOut = () => {
    localStorage.removeItem('ims_user')
    setUser(null)
  }

  const isAdmin = () => user?.role === 'ADMIN' || user?.role === 'ROLE_ADMIN'

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)