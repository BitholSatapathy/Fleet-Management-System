import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const getStoredAuth = () => {
  const storedUser = localStorage.getItem('authUser')
  const storedRole = localStorage.getItem('authRole')

  if (!storedUser || !storedRole) {
    return { user: null, role: null }
  }

  return {
    user: storedUser,
    role: storedRole,
  }
}

const AuthProvider = ({ children }) => {
  const initialAuth = getStoredAuth()
  const [user, setUser] = useState(initialAuth.user)
  const [role, setRole] = useState(initialAuth.role)

  const login = (username, password) => {
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('authUser', username)
      localStorage.setItem('authRole', 'Admin')
      setUser(username)
      setRole('Admin')
      return 'Admin'
    }

    if (username === 'driver' && password === 'driver123') {
      localStorage.setItem('authUser', username)
      localStorage.setItem('authRole', 'Driver')
      setUser(username)
      setRole('Driver')
      return 'Driver'
    }

    return false
  }

  const logout = () => {
    localStorage.removeItem('authUser')
    localStorage.removeItem('authRole')
    setUser(null)
    setRole(null)
  }

  const value = useMemo(
    () => ({ user, role, login, logout }),
    [user, role],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }