import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usersAPI } from '../services/api'
import { normalizeCars } from '../utils/normalize'
import CarCard from '../components/cars/CarCard'
import { Heart, Loader2 } from 'lucide-react'

export default function Favorites() {
  const { user, loading: authLoading } = useAuth()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    usersAPI.getFavorites()
      .then((res) => setFavorites(normalizeCars(res.data)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (authLoading) return <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 m-0">Favoriti</h1>
        <p className="text-gray-500 text-sm mt-1 m-0">{favorites.length} sačuvanih oglasa</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((car) => (<CarCard key={car.id} car={car} />))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nemate favorita</h3>
          <p className="text-gray-500 text-sm">Kliknite na srce da sačuvate oglas koji vam se sviđa</p>
        </div>
      )}
    </div>
  )
}
