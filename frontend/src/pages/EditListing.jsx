import { useState, useEffect } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { carsAPI } from '../services/api'
import { brands, fuelTypes, transmissions, bodyTypes, colors, locations } from '../data/mockCars'
import { Upload, X, Save, Loader2, Star, Trash2 } from 'lucide-react'

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 40 }, (_, i) => currentYear - i)

export default function EditListing() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [loadingCar, setLoadingCar] = useState(true)
  const [error, setError] = useState('')
  const [newImages, setNewImages] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [carStatus, setCarStatus] = useState('active')
  const [form, setForm] = useState({
    brand: '', model: '', year: '', price: '', mileage: '',
    fuel: '', transmission: '', horsepower: '', engine_size: '',
    body_type: '', color: '', doors: '5', location: '', description: '',
  })

  useEffect(() => {
    carsAPI.get(id)
      .then((res) => {
        const car = res.data
        setForm({
          brand: car.brand || '',
          model: car.model || '',
          year: String(car.year || ''),
          price: String(car.price || ''),
          mileage: car.mileage != null ? String(car.mileage) : '',
          fuel: car.fuel || '',
          transmission: car.transmission || '',
          horsepower: car.horsepower != null ? String(car.horsepower) : '',
          engine_size: car.engine_size != null ? String(car.engine_size) : '',
          body_type: car.body_type || '',
          color: car.color || '',
          doors: String(car.doors || 5),
          location: car.location || '',
          description: car.description || '',
        })
        setCarStatus(car.status || 'active')
        setExistingImages(car.images || [])
      })
      .catch(() => setError('Oglas nije pronađen'))
      .finally(() => setLoadingCar(false))
  }, [id])

  if (authLoading || loadingCar) return <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
  if (!user) return <Navigate to="/login" replace />

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const imgs = files.map((file) => ({ file, preview: URL.createObjectURL(file) }))
    setNewImages((prev) => [...prev, ...imgs].slice(0, 10 - existingImages.length))
  }

  const removeNewImage = (index) => setNewImages((prev) => prev.filter((_, i) => i !== index))

  const deleteExistingImage = async (imageId) => {
    try {
      await carsAPI.deleteImage(id, imageId)
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId))
    } catch {
      setError('Greška pri brisanju slike')
    }
  }

  const setAsThumbnail = async (imageId) => {
    try {
      const res = await carsAPI.setPrimaryImage(id, imageId)
      setExistingImages(res.data.images || [])
    } catch {
      setError('Greška pri postavljanju thumbnail-a')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.brand || !form.model || !form.year || !form.price || !form.fuel || !form.transmission) {
      setError('Molimo popunite sva obavezna polja')
      return
    }

    setSubmitting(true)
    try {
      const carData = {
        ...form,
        year: Number(form.year),
        price: Number(form.price),
        mileage: form.mileage ? Number(form.mileage) : null,
        horsepower: form.horsepower ? Number(form.horsepower) : null,
        engine_size: form.engine_size ? Number(form.engine_size) : null,
        doors: Number(form.doors),
        status: carStatus,
      }

      await carsAPI.update(id, carData)

      if (newImages.length > 0) {
        const formData = new FormData()
        newImages.forEach((img) => formData.append('files', img.file))
        await carsAPI.uploadImages(id, formData)
      }

      navigate(`/automobili/${id}`)
    } catch (err) {
      setError(err.response?.data?.detail || 'Greška pri ažuriranju oglasa')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5"

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Izmeni oglas</h1>
        <p className="text-gray-500 text-sm">Ažurirajte informacije o automobilu</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg border border-red-100">{error}</div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Status oglasa</h2>
          <div className="flex flex-wrap gap-3">
            {[
              { value: 'active', label: 'Aktivan', color: 'bg-green-50 border-green-300 text-green-700', active: 'bg-green-600 border-green-600 text-white' },
              { value: 'reserved', label: 'Rezervisan', color: 'bg-amber-50 border-amber-300 text-amber-700', active: 'bg-amber-500 border-amber-500 text-white' },
              { value: 'sold', label: 'Prodat', color: 'bg-red-50 border-red-300 text-red-700', active: 'bg-red-600 border-red-600 text-white' },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCarStatus(opt.value)}
                className={`px-5 py-2.5 rounded-lg font-medium text-sm border cursor-pointer transition-all ${carStatus === opt.value ? opt.active : opt.color}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {carStatus === 'sold' && (
            <p className="text-sm text-red-600 mt-2 m-0">Oglas će biti označen kao prodat i neće se prikazivati u pretrazi.</p>
          )}
          {carStatus === 'reserved' && (
            <p className="text-sm text-amber-600 mt-2 m-0">Oglas će biti označen kao rezervisan i neće se prikazivati u pretrazi.</p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Fotografije</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
            {existingImages.map((img) => (
              <div key={img.id} className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 ${img.is_primary ? 'ring-2 ring-primary-500' : ''}`}>
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors group">
                  <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setAsThumbnail(img.id)}
                      className={`p-1 rounded-full border-0 cursor-pointer ${img.is_primary ? 'bg-primary-500 text-white' : 'bg-white/90 text-gray-600 hover:text-primary-600'}`}
                      title="Postavi kao thumbnail"
                    >
                      <Star size={12} fill={img.is_primary ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExistingImage(img.id)}
                      className="p-1 rounded-full bg-red-500 text-white border-0 cursor-pointer hover:bg-red-600"
                      title="Obriši sliku"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                {img.is_primary ? (
                  <div className="absolute bottom-1 left-1 bg-primary-500 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Star size={8} fill="currentColor" /> Thumbnail
                  </div>
                ) : null}
              </div>
            ))}
            {newImages.map((img, i) => (
              <div key={`new-${i}`} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full border-0 cursor-pointer"><X size={12} /></button>
              </div>
            ))}
            {(existingImages.length + newImages.length) < 10 && (
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary-300 hover:bg-primary-50/30 transition-colors">
                <Upload size={20} className="text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Dodaj</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-2">Maksimalno 10 fotografija.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Osnovne informacije</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>Marka *</label><select value={form.brand} onChange={(e) => updateField('brand', e.target.value)} className={inputClass}><option value="">Izaberite</option>{brands.map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
            <div><label className={labelClass}>Model *</label><input type="text" value={form.model} onChange={(e) => updateField('model', e.target.value)} placeholder="npr. 320d" className={inputClass} /></div>
            <div><label className={labelClass}>Godište *</label><select value={form.year} onChange={(e) => updateField('year', e.target.value)} className={inputClass}><option value="">Izaberite</option>{yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}</select></div>
            <div><label className={labelClass}>Cena (EUR) *</label><input type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} placeholder="25000" className={inputClass} /></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Tehničke karakteristike</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelClass}>Kilometraža</label><input type="number" value={form.mileage} onChange={(e) => updateField('mileage', e.target.value)} placeholder="85000" className={inputClass} /></div>
            <div><label className={labelClass}>Gorivo *</label><select value={form.fuel} onChange={(e) => updateField('fuel', e.target.value)} className={inputClass}><option value="">Izaberite</option>{fuelTypes.map((f) => <option key={f} value={f}>{f}</option>)}</select></div>
            <div><label className={labelClass}>Menjač *</label><select value={form.transmission} onChange={(e) => updateField('transmission', e.target.value)} className={inputClass}><option value="">Izaberite</option>{transmissions.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
            <div><label className={labelClass}>Snaga (KS)</label><input type="number" value={form.horsepower} onChange={(e) => updateField('horsepower', e.target.value)} placeholder="190" className={inputClass} /></div>
            <div><label className={labelClass}>Zapremina (L)</label><input type="number" step="0.1" value={form.engine_size} onChange={(e) => updateField('engine_size', e.target.value)} placeholder="2.0" className={inputClass} /></div>
            <div><label className={labelClass}>Karoserija</label><select value={form.body_type} onChange={(e) => updateField('body_type', e.target.value)} className={inputClass}><option value="">Izaberite</option>{bodyTypes.map((bt) => <option key={bt} value={bt}>{bt}</option>)}</select></div>
            <div><label className={labelClass}>Boja</label><select value={form.color} onChange={(e) => updateField('color', e.target.value)} className={inputClass}><option value="">Izaberite</option>{colors.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
            <div><label className={labelClass}>Broj vrata</label><select value={form.doors} onChange={(e) => updateField('doors', e.target.value)} className={inputClass}><option value="3">3</option><option value="4">4</option><option value="5">5</option></select></div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Lokacija i opis</h2>
          <div className="space-y-4">
            <div><label className={labelClass}>Lokacija *</label><select value={form.location} onChange={(e) => updateField('location', e.target.value)} className={inputClass}><option value="">Izaberite grad</option>{locations.map((loc) => <option key={loc} value={loc}>{loc}</option>)}</select></div>
            <div><label className={labelClass}>Opis</label><textarea value={form.description} onChange={(e) => updateField('description', e.target.value)} rows={5} placeholder="Opišite vaš automobil..." className={`${inputClass} resize-none`} /></div>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 border border-gray-200 rounded-lg text-gray-700 font-medium bg-white cursor-pointer hover:bg-gray-50 transition-colors">Otkaži</button>
          <button type="submit" disabled={submitting} className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 border-0 cursor-pointer transition-colors">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {submitting ? 'Čuvanje...' : 'Sačuvaj izmene'}
          </button>
        </div>
      </form>
    </div>
  )
}
