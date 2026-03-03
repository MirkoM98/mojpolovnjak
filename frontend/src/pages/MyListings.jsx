import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usersAPI, carsAPI } from '../services/api'
import { normalizeCars } from '../utils/normalize'
import { PlusCircle, Edit, Trash2, Eye, Loader2 } from 'lucide-react'
import { formatPrice, formatMileage, timeAgo } from '../utils/formatters'

export default function MyListings() {
  const { user, loading: authLoading } = useAuth()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    usersAPI.getMyCars()
      .then((res) => setListings(normalizeCars(res.data)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  if (authLoading) return <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
  if (!user) return <Navigate to="/login" replace />

  const handleDelete = async (carId) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj oglas?')) return
    try {
      await carsAPI.delete(carId)
      setListings((prev) => prev.filter((c) => c.id !== carId))
    } catch {}
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 m-0">Moji oglasi</h1>
          <p className="text-gray-500 text-sm mt-1 m-0">{listings.length} oglasa</p>
        </div>
        <Link to="/novi-oglas" className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-primary-700 no-underline transition-colors text-sm">
          <PlusCircle size={18} /> Novi oglas
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
      ) : listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((car) => (
            <div key={car.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col sm:flex-row">
              <div className="sm:w-48 h-40 sm:h-auto shrink-0">
                <img src={car.images[0] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'} alt={car.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 m-0">{car.title}</h3>
                  <p className="text-xl font-bold text-primary-600 mt-1 mb-2">{formatPrice(car.price)}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>{car.year}.</span>
                    <span>{formatMileage(car.mileage)}</span>
                    <span>{car.fuel}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 m-0">Postavljen {timeAgo(car.createdAt)}</p>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Link to={`/automobili/${car.id}`} className="flex items-center gap-1.5 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm no-underline hover:bg-gray-100 transition-colors">
                    <Eye size={14} /> Pogledaj
                  </Link>
                  <button onClick={() => handleDelete(car.id)} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm border-0 cursor-pointer hover:bg-red-100 transition-colors">
                    <Trash2 size={14} /> Obriši
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <PlusCircle size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nemate oglasa</h3>
          <p className="text-gray-500 text-sm mb-4">Postavite svoj prvi oglas i dođite do kupaca</p>
          <Link to="/novi-oglas" className="text-primary-600 font-medium no-underline hover:text-primary-700">Postavi oglas</Link>
        </div>
      )}
    </div>
  )
}
