import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { adminAPI } from '../services/api'
import { formatPrice, timeAgo } from '../utils/formatters'
import {
  Users, Car, Loader2, Shield, ShieldOff, Trash2, Pencil,
  Search, AlertTriangle, UserPlus,
} from 'lucide-react'

export default function Admin() {
  const { user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState('cars')

  if (authLoading) return <div className="flex justify-center py-24"><Loader2 size={32} className="animate-spin text-primary-600" /></div>
  if (!user || !user.is_admin) return <Navigate to="/" replace />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Admin Panel</h1>
        <p className="text-gray-500 text-sm">Upravljanje korisnicima i oglasima</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('cars')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors ${
            tab === 'cars' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Car size={16} /> Oglasi
        </button>
        <button
          onClick={() => setTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors ${
            tab === 'users' ? 'bg-primary-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Users size={16} /> Korisnici
        </button>
      </div>

      {tab === 'cars' ? <CarsTab /> : <UsersTab />}
    </div>
  )
}

function CarsTab() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasNext, setHasNext] = useState(false)
  const [deleting, setDeleting] = useState(null)

  const fetchCars = async () => {
    setLoading(true)
    try {
      const res = await adminAPI.getCars({ page, page_size: 20, search: search || undefined })
      setCars(res.data.cars)
      setTotal(res.data.total)
      setHasNext(res.data.has_next)
    } catch {
      setCars([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCars() }, [page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1)
    fetchCars()
  }

  const handleDelete = async (carId) => {
    if (!confirm('Da li ste sigurni da želite da obrišete ovaj oglas?')) return
    setDeleting(carId)
    try {
      await adminAPI.deleteCar(carId)
      setCars((prev) => prev.filter((c) => c.id !== carId))
      setTotal((prev) => prev - 1)
    } catch { /* ignore */ }
    setDeleting(null)
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <span className="text-sm text-gray-500">Ukupno: {total} oglasa</span>
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pretraži..."
              className="pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm border-0 cursor-pointer hover:bg-primary-700">
            Traži
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-primary-600" /></div>
      ) : cars.length === 0 ? (
        <div className="text-center py-12 text-gray-500 text-sm">Nema oglasa</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Automobil</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Cena</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Prodavac</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Datum</th>
                <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Akcije</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm text-gray-500">#{car.id}</td>
                  <td className="px-4 py-3">
                    <Link to={`/automobili/${car.id}`} className="text-sm font-medium text-gray-900 hover:text-primary-600 no-underline">
                      {car.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatPrice(car.price)}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{car.seller?.name}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      car.status === 'active' ? 'bg-green-100 text-green-700' :
                      car.status === 'sold' ? 'bg-gray-100 text-gray-600' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {car.status === 'active' ? 'Aktivan' : car.status === 'sold' ? 'Prodat' : 'Pauziran'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{timeAgo(car.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        to={`/edit-oglas/${car.id}`}
                        className="p-2 text-gray-400 hover:text-primary-600 rounded-lg hover:bg-primary-50 no-underline"
                        title="Izmeni"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(car.id)}
                        disabled={deleting === car.id}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 border-0 bg-transparent cursor-pointer"
                        title="Obriši"
                      >
                        {deleting === car.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(page > 1 || hasNext) && (
        <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer disabled:opacity-50 hover:bg-gray-50"
          >
            Prethodna
          </button>
          <span className="px-4 py-2 text-sm text-gray-500">Strana {page}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNext}
            className="px-4 py-2 text-sm border border-gray-200 rounded-lg bg-white cursor-pointer disabled:opacity-50 hover:bg-gray-50"
          >
            Sledeća
          </button>
        </div>
      )}
    </div>
  )
}

function UsersTab() {
  const { user: currentAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [toggling, setToggling] = useState(null)

  useEffect(() => {
    adminAPI.getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleMakeAdmin = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setMessage({ type: '', text: '' })
    try {
      await adminAPI.makeAdmin(email.trim())
      setMessage({ type: 'success', text: `${email} je sada admin!` })
      setEmail('')
      const res = await adminAPI.getUsers()
      setUsers(res.data)
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Greška' })
    }
  }

  const handleToggleAdmin = async (userId, isAdmin) => {
    if (userId === currentAdmin.id) return
    setToggling(userId)
    try {
      if (isAdmin) {
        await adminAPI.removeAdmin(userId)
      } else {
        const user = users.find((u) => u.id === userId)
        if (user) await adminAPI.makeAdmin(user.email)
      }
      const res = await adminAPI.getUsers()
      setUsers(res.data)
    } catch { /* ignore */ }
    setToggling(null)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <UserPlus size={18} /> Dodaj novog admina
        </h3>
        <form onSubmit={handleMakeAdmin} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email adresa korisnika"
            className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500"
          />
          <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium border-0 cursor-pointer hover:bg-primary-700">
            Dodaj
          </button>
        </form>
        {message.text && (
          <p className={`mt-3 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
          </p>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">Ukupno: {users.length} korisnika</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-primary-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Ime</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Telefon</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Registrovan</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Uloga</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm text-gray-500">#{u.id}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.phone || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{timeAgo(u.created_at)}</td>
                    <td className="px-4 py-3">
                      {u.is_admin ? (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-700 flex items-center gap-1 w-fit">
                          <Shield size={12} /> Admin
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Korisnik</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.id !== currentAdmin.id && (
                        <button
                          onClick={() => handleToggleAdmin(u.id, u.is_admin)}
                          disabled={toggling === u.id}
                          className={`p-2 rounded-lg border-0 bg-transparent cursor-pointer ${
                            u.is_admin ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-primary-50 hover:text-primary-600'
                          }`}
                          title={u.is_admin ? 'Ukloni admin' : 'Dodaj admin'}
                        >
                          {toggling === u.id ? <Loader2 size={16} className="animate-spin" /> :
                           u.is_admin ? <ShieldOff size={16} /> : <Shield size={16} />}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
