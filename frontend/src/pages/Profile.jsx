import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { usersAPI } from '../services/api'
import { User, Mail, Phone, Camera, Save, Loader2 } from 'lucide-react'

export default function Profile() {
  const { user, loading: authLoading } = useAuth()
  const [saved, setSaved] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  })

  if (authLoading) return <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
  if (!user) return <Navigate to="/login" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await usersAPI.updateProfile({ name: form.name, phone: form.phone })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    setSubmitting(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Moj profil</h1>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <User size={40} className="text-white" />
              </div>
              <button className="absolute bottom-0 right-0 bg-white text-primary-600 p-1.5 rounded-full border-0 cursor-pointer shadow-sm">
                <Camera size={14} />
              </button>
            </div>
            <div className="text-white">
              <h2 className="text-xl font-semibold m-0">{user.name}</h2>
              <p className="text-primary-200 text-sm m-0">{user.email}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {saved && (
            <div className="bg-green-50 text-green-700 text-sm px-4 py-3 rounded-lg border border-green-100">
              Profil je uspešno ažuriran!
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ime i prezime</label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={form.email} disabled className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100" />
            </div>
          </div>

          <button type="submit" disabled={submitting} className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary-700 border-0 cursor-pointer transition-colors disabled:opacity-50">
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Sačuvaj izmene
          </button>
        </form>
      </div>
    </div>
  )
}
