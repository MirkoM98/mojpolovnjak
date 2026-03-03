import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI, usersAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      usersAPI.getProfile()
        .then((res) => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password)
      localStorage.setItem('token', res.data.access_token)
      const profileRes = await usersAPI.getProfile()
      setUser(profileRes.data)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Greška pri prijavi' }
    }
  }

  const register = async (data) => {
    try {
      await authAPI.register(data)
      const loginRes = await authAPI.login(data.email, data.password)
      localStorage.setItem('token', loginRes.data.access_token)
      const profileRes = await usersAPI.getProfile()
      setUser(profileRes.data)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Greška pri registraciji' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
