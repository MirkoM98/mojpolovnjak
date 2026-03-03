import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Heart, Share2, MapPin, Calendar, Gauge, Fuel,
  Settings, Palette, DoorOpen, Zap, Phone, MessageCircle, User,
  Check, ChevronLeft, ChevronRight, Loader2,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { carsAPI } from '../services/api'
import { normalizeCar, normalizeCars } from '../utils/normalize'
import CarCard from '../components/cars/CarCard'
import { formatPrice, formatMileage, timeAgo } from '../utils/formatters'
import { useAuth } from '../context/AuthContext'

export default function CarDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, toggleFavorite, isFavorite } = useAuth()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPhone, setShowPhone] = useState(false)
  const [currentImage, setCurrentImage] = useState(0)
  const [slideDir, setSlideDir] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [similarCars, setSimilarCars] = useState([])
  const liked = isFavorite(Number(id))

  const goToImage = (direction) => {
    if (animating || !car) return
    setSlideDir(direction)
    setAnimating(true)
    setTimeout(() => {
      setCurrentImage((p) => (p + direction + car.images.length) % car.images.length)
      setSlideDir(0)
      setAnimating(false)
    }, 250)
  }

  useEffect(() => {
    setLoading(true)
    setCurrentImage(0)
    carsAPI.get(id)
      .then((res) => {
        const normalized = normalizeCar(res.data)
        setCar(normalized)
        return carsAPI.list({ brand: normalized.brand, page_size: 4 })
      })
      .then((res) => {
        const similar = normalizeCars(res.data.cars).filter((c) => c.id !== Number(id)).slice(0, 3)
        setSimilarCars(similar)
      })
      .catch(() => setCar(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    )
  }

  if (!car) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Oglas nije pronađen</h2>
        <Link to="/automobili" className="text-primary-600 font-medium no-underline">
          Nazad na listu automobila
        </Link>
      </div>
    )
  }

  const specs = [
    { icon: Calendar, label: 'Godište', value: `${car.year}.` },
    { icon: Gauge, label: 'Kilometraža', value: formatMileage(car.mileage) },
    { icon: Fuel, label: 'Gorivo', value: car.fuel },
    { icon: Settings, label: 'Menjač', value: car.transmission },
    { icon: Zap, label: 'Snaga', value: `${car.horsepower} KS` },
    { icon: Palette, label: 'Boja', value: car.color },
    { icon: DoorOpen, label: 'Vrata', value: car.doors },
    { icon: Gauge, label: 'Zapremina', value: `${car.engineSize}L` },
  ]

  const mainImage = car.images[currentImage] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link to="/automobili" className="flex items-center gap-1 text-gray-500 hover:text-primary-600 text-sm no-underline">
          <ArrowLeft size={16} /> Svi automobili
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-sm text-gray-700">{car.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
              <img
                src={mainImage}
                alt={car.title}
                className="w-full h-full object-cover transition-all duration-250 ease-in-out"
                style={{
                  transform: slideDir !== 0 ? `translateX(${slideDir > 0 ? '-100' : '100'}%)` : 'translateX(0)',
                  opacity: slideDir !== 0 ? 0 : 1,
                }}
              />
              {car.images.length > 1 && (
                <>
                  <button onClick={() => goToImage(-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md border-0 cursor-pointer hover:bg-white hover:scale-110 transition-transform">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={() => goToImage(1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-md border-0 cursor-pointer hover:bg-white hover:scale-110 transition-transform">
                    <ChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {car.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { if (i !== currentImage) { setSlideDir(i > currentImage ? 1 : -1); setAnimating(true); setTimeout(() => { setCurrentImage(i); setSlideDir(0); setAnimating(false) }, 250) } }}
                        className={`w-2 h-2 rounded-full border-0 cursor-pointer transition-all duration-200 ${i === currentImage ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-3 right-3 flex gap-2">
                <button onClick={() => { if (!user) { navigate('/prijava'); return } toggleFavorite(Number(id)) }} className={`p-2.5 rounded-full backdrop-blur-sm border-0 cursor-pointer ${liked ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-600 hover:text-red-500'}`}>
                  <Heart size={20} fill={liked ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2.5 rounded-full bg-white/90 text-gray-600 border-0 cursor-pointer hover:text-primary-600">
                  <Share2 size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="lg:hidden">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{car.title}</h1>
            <p className="text-3xl font-bold text-primary-600 mb-4">{formatPrice(car.price)}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 text-lg mb-4">Specifikacije</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon size={14} className="text-primary-600" />
                    <span className="text-xs text-gray-500">{label}</span>
                  </div>
                  <p className="font-semibold text-gray-900 text-sm m-0">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {car.description && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-3">Opis</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{car.description}</p>
            </div>
          )}

          {car.features?.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-4">Oprema</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {car.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                    <Check size={16} className="text-green-500 shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <div className="hidden lg:block bg-white rounded-xl border border-gray-100 p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-2">{car.title}</h1>
              <p className="text-3xl font-bold text-primary-600 mb-1">{formatPrice(car.price)}</p>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <MapPin size={14} />
                <span>{car.location}</span>
                <span className="mx-1">·</span>
                <span>{timeAgo(car.createdAt)}</span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Prodavac</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-medium text-gray-900 m-0">{car.seller.name}</p>
                  <p className="text-sm text-gray-500 m-0">{car.location}</p>
                </div>
              </div>
              <div className="space-y-3">
                {showPhone && car.seller.phone ? (
                  <a href={`tel:${car.seller.phone}`} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 no-underline transition-colors">
                    <Phone size={18} />{car.seller.phone}
                  </a>
                ) : (
                  <button onClick={() => setShowPhone(true)} className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-xl font-medium hover:bg-green-700 border-0 cursor-pointer transition-colors">
                    <Phone size={18} />Prikaži broj telefona
                  </button>
                )}
                <button className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 border-0 cursor-pointer transition-colors">
                  <MessageCircle size={18} />Pošalji poruku
                </button>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-medium text-amber-800 text-sm mb-2">Saveti za sigurnu kupovinu</h4>
              <ul className="space-y-1.5 text-xs text-amber-700 list-none p-0 m-0">
                <li className="flex items-start gap-1.5"><Check size={12} className="shrink-0 mt-0.5" />Uvek pogledajte automobil uživo pre kupovine</li>
                <li className="flex items-start gap-1.5"><Check size={12} className="shrink-0 mt-0.5" />Tražite servisnu knjižicu i dokumentaciju</li>
                <li className="flex items-start gap-1.5"><Check size={12} className="shrink-0 mt-0.5" />Ne plaćajte unapred bez provere</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {similarCars.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Slični automobili</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarCars.map((c) => (<CarCard key={c.id} car={c} />))}
          </div>
        </section>
      )}
    </div>
  )
}
