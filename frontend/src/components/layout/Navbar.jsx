import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Car, Menu, X, User, LogOut, Heart, PlusCircle, List, Shield } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setProfileOpen(false)
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 no-underline">
            <div className="bg-primary-600 text-white p-2 rounded-lg">
              <Car size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Moj<span className="text-primary-600">Polovnjak</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/automobili" className="text-gray-600 hover:text-primary-600 font-medium no-underline transition-colors">
              Automobili
            </Link>
            {user && (
              <Link to="/novi-oglas" className="text-gray-600 hover:text-primary-600 font-medium no-underline transition-colors">
                Postavi oglas
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border-0 bg-transparent cursor-pointer"
                >
                  <div className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                </button>

                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 m-0">{user.name}</p>
                        <p className="text-xs text-gray-500 m-0">{user.email}</p>
                      </div>
                      <Link to="/profil" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline">
                        <User size={16} /> Moj profil
                      </Link>
                      <Link to="/moji-oglasi" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline">
                        <List size={16} /> Moji oglasi
                      </Link>
                      <Link to="/favoriti" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline">
                        <Heart size={16} /> Favoriti
                      </Link>
                      <Link to="/novi-oglas" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 no-underline">
                        <PlusCircle size={16} /> Novi oglas
                      </Link>
                      {user.is_admin && (
                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50 no-underline">
                          <Shield size={16} /> Admin panel
                        </Link>
                      )}
                      <hr className="my-1 border-gray-100" />
                      <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full border-0 bg-transparent cursor-pointer">
                        <LogOut size={16} /> Odjavi se
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 font-medium text-sm no-underline transition-colors">
                  Prijavi se
                </Link>
                <Link to="/registracija" className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-primary-700 no-underline transition-colors">
                  Registruj se
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 border-0 bg-transparent cursor-pointer"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            <Link to="/automobili" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg no-underline">
              Automobili
            </Link>
            {user ? (
              <>
                <Link to="/novi-oglas" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg no-underline">
                  Postavi oglas
                </Link>
                <Link to="/profil" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg no-underline">
                  Moj profil
                </Link>
                <Link to="/moji-oglasi" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg no-underline">
                  Moji oglasi
                </Link>
                <Link to="/favoriti" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg no-underline">
                  Favoriti
                </Link>
                {user.is_admin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-2 text-purple-700 hover:bg-purple-50 rounded-lg no-underline font-medium">
                    Admin panel
                  </Link>
                )}
                <button onClick={() => { handleLogout(); setMobileOpen(false) }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg border-0 bg-transparent cursor-pointer">
                  Odjavi se
                </button>
              </>
            ) : (
              <div className="flex gap-2 px-4 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 border border-gray-300 rounded-lg text-gray-700 no-underline">
                  Prijavi se
                </Link>
                <Link to="/registracija" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2 bg-primary-600 text-white rounded-lg no-underline">
                  Registruj se
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
