import { Link, useNavigate } from 'react-router-dom'
import { Heart, MapPin, Calendar, Gauge, Fuel, Settings } from 'lucide-react'
import { formatPrice, formatMileage, timeAgo } from '../../utils/formatters'
import { useAuth } from '../../context/AuthContext'

export default function CarCard({ car }) {
  const { user, toggleFavorite, isFavorite } = useAuth()
  const navigate = useNavigate()
  const liked = isFavorite(car.id)

  return (
    <Link
      to={`/automobili/${car.id}`}
      className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 no-underline block"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={car.images[0]}
          alt={car.title}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${car.status === 'sold' ? 'grayscale opacity-70' : ''}`}
        />
        {car.status === 'sold' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <span className="bg-red-600 text-white text-sm font-bold px-4 py-1.5 rounded-lg uppercase tracking-wider">Prodato</span>
          </div>
        )}
        {car.status === 'reserved' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="bg-amber-500 text-white text-sm font-bold px-4 py-1.5 rounded-lg uppercase tracking-wider">Rezervisano</span>
          </div>
        )}
        {car.status !== 'sold' && (
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (!user) { navigate('/prijava'); return }
              toggleFavorite(car.id)
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-colors border-0 cursor-pointer ${
              liked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </button>
        )}
        <div className="absolute bottom-3 left-3">
          <span className="bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md">
            {car.bodyType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-base m-0 group-hover:text-primary-600 transition-colors line-clamp-1">
            {car.title}
          </h3>
        </div>

        <p className={`text-2xl font-bold m-0 mb-3 ${car.status === 'sold' ? 'text-gray-400 line-through' : 'text-primary-600'}`}>
          {formatPrice(car.price)}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Calendar size={14} className="shrink-0" />
            <span>{car.year}.</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Gauge size={14} className="shrink-0" />
            <span>{formatMileage(car.mileage)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Fuel size={14} className="shrink-0" />
            <span>{car.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <Settings size={14} className="shrink-0" />
            <span>{car.transmission}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin size={12} />
            <span>{car.location}</span>
          </div>
          <span className="text-gray-400 text-xs">{timeAgo(car.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
