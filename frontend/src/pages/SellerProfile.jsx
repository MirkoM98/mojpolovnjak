import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User, MapPin, Phone, Calendar, Camera, Save, Loader2, Car, Pencil, X, ImageIcon } from 'lucide-react'
import { usersAPI } from '../services/api'
import { normalizeCars } from '../utils/normalize'
import { timeAgo } from '../utils/formatters'
import CarCard from '../components/cars/CarCard'
import { useAuth } from '../context/AuthContext'

export default function SellerProfile() {
  const { id } = useParams()
  const { user } = useAuth()
  const [seller, setSeller] = useState(null)
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const coverInputRef = useRef(null)

  const isOwner = user && seller && user.id === seller.id

  useEffect(() => {
    setLoading(true)
    Promise.all([
      usersAPI.getPublicProfile(id),
      usersAPI.getUserCars(id),
    ])
      .then(([profileRes, carsRes]) => {
        setSeller(profileRes.data)
        setBio(profileRes.data.bio || '')
        setCars(normalizeCars(carsRes.data))
      })
      .catch(() => setSeller(null))
      .finally(() => setLoading(false))
  }, [id])

  const saveBio = async () => {
    setSaving(true)
    try {
      const res = await usersAPI.updateProfile({ bio })
      setSeller((prev) => ({ ...prev, bio: res.data.bio }))
      setEditing(false)
    } catch {
      /* ignore */
    } finally {
      setSaving(false)
    }
  }

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingCover(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await usersAPI.uploadCoverImage(formData)
      setSeller((prev) => ({ ...prev, cover_image_url: res.data.cover_image_url }))
    } catch {
      /* ignore */
    } finally {
      setUploadingCover(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 size={32} className="animate-spin text-primary-600" />
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Prodavac nije pronađen</h2>
        <Link to="/automobili" className="text-primary-600 font-medium no-underline">
          Nazad na listu automobila
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Cover image */}
      <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden bg-gradient-to-r from-primary-600 to-primary-800 mb-6">
        {seller.cover_image_url ? (
          <img src={seller.cover_image_url} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={48} className="text-white/30" />
          </div>
        )}
        {isOwner && (
          <>
            <button
              onClick={() => coverInputRef.current?.click()}
              disabled={uploadingCover}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer hover:bg-white transition-colors"
            >
              {uploadingCover ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
              {uploadingCover ? 'Otpremanje...' : seller.cover_image_url ? 'Promeni cover' : 'Dodaj cover sliku'}
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverUpload}
              className="hidden"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-100 p-6 -mt-16 lg:-mt-20 relative z-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-3 border-4 border-white shadow-md">
                {seller.avatar_url ? (
                  <img src={seller.avatar_url} alt={seller.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User size={36} />
                )}
              </div>
              <h1 className="text-lg font-bold text-gray-900 mb-1">{seller.name}</h1>
              <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                <Calendar size={12} />
                <span>Član od {new Date(seller.created_at).toLocaleDateString('sr-Latn-RS', { month: 'long', year: 'numeric' })}</span>
              </div>

              {seller.phone && (
                <a href={`tel:${seller.phone}`} className="flex items-center gap-1.5 text-sm text-gray-600 no-underline hover:text-primary-600 mb-3">
                  <Phone size={14} /> {seller.phone}
                </a>
              )}

              <div className="flex items-center gap-1.5 text-sm text-primary-600 font-medium">
                <Car size={14} />
                <span>{cars.length} {cars.length === 1 ? 'aktivan oglas' : 'aktivna oglasa'}</span>
              </div>
            </div>

            {/* Bio section */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">O prodavcu</h3>
                {isOwner && !editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="p-1 text-gray-400 hover:text-primary-600 border-0 bg-transparent cursor-pointer"
                  >
                    <Pencil size={14} />
                  </button>
                )}
              </div>
              {editing ? (
                <div className="space-y-2">
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Napišite nešto o sebi ili vašem salonu..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveBio}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1 bg-primary-600 text-white py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer hover:bg-primary-700 disabled:opacity-50"
                    >
                      {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                      Sačuvaj
                    </button>
                    <button
                      onClick={() => { setEditing(false); setBio(seller.bio || '') }}
                      className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 bg-white cursor-pointer hover:bg-gray-50"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500 m-0">
                  {seller.bio || (isOwner ? 'Kliknite olovku da dodate opis...' : 'Prodavac nije dodao opis.')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Car listings */}
        <div className="lg:col-span-3">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Oglasi prodavca
          </h2>
          {cars.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
              <Car size={48} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500">Ovaj prodavac nema aktivnih oglasa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
