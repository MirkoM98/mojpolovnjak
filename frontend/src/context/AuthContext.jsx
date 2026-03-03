import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authAPI, usersAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [favoriteIds, setFavoriteIds] = useState(new Set())

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await usersAPI.getFavorites()
      setFavoriteIds(new Set(res.data.map((car) => car.id)))
    } catch {
      setFavoriteIds(new Set())
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      usersAPI.getProfile()
        .then((res) => {
          setUser(res.data)
          return fetchFavorites()
        })
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [fetchFavorites])

  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password)
      localStorage.setItem('token', res.data.access_token)
      const profileRes = await usersAPI.getProfile()
      setUser(profileRes.data)
      await fetchFavorites()
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

  const toggleFavorite = async (carId) => {
    if (!user) return false
    try {
      if (favoriteIds.has(carId)) {
        await usersAPI.removeFavorite(carId)
        setFavoriteIds((prev) => { const next = new Set(prev); next.delete(carId); return next })
      } else {
        await usersAPI.addFavorite(carId)
        setFavoriteIds((prev) => new Set(prev).add(carId))
      }
      return true
    } catch {
      return false
    }
  }

  const isFavorite = (carId) => favoriteIds.has(carId)

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setFavoriteIds(new Set())
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, toggleFavorite, isFavorite }}>
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
