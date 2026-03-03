import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Shield, TrendingUp, Users, ArrowRight, Car, Star, Loader2, AlertTriangle } from 'lucide-react'
import CarCard from '../components/cars/CarCard'
import { carsAPI } from '../services/api'
import { normalizeCars } from '../utils/normalize'
import { brands as allBrands } from '../data/mockCars'

const stats = [
  { label: 'Aktivnih oglasa', value: '12,500+', icon: Car },
  { label: 'Zadovoljnih korisnika', value: '8,200+', icon: Users },
  { label: 'Novih oglasa dnevno', value: '350+', icon: TrendingUp },
]

const features = [
  {
    icon: Search,
    title: 'Napredna pretraga',
    desc: 'Filtrirajte po marki, ceni, godištu, gorivu i još mnogo toga.',
  },
  {
    icon: Shield,
    title: 'Sigurna kupovina',
    desc: 'Verifikovani prodavci i detaljne informacije o svakom vozilu.',
  },
  {
    icon: Star,
    title: 'Najbolje ponude',
    desc: 'Hiljade automobila po najboljim cenama na jednom mestu.',
  },
]

export default function Home() {
  const [featuredCars, setFeaturedCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const popularBrands = allBrands.slice(0, 8)

  useEffect(() => {
    carsAPI.list({ page_size: 6, sort: 'newest' })
      .then((res) => setFeaturedCars(normalizeCars(res.data.cars)))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 50%, white 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Pronađite savršen
              <span className="text-primary-300"> polovni automobil</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed">
              Najveći izbor polovnih automobila u Srbiji. Pretražujte, uporedite i pronađite vaš sledeći auto na jednom mestu.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/automobili"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 px-6 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-colors no-underline text-base"
              >
                <Search size={20} />
                Pretraži automobile
              </Link>
              <Link
                to="/novi-oglas"
                className="inline-flex items-center justify-center gap-2 bg-primary-600 text-white px-6 py-3.5 rounded-xl font-semibold border-2 border-primary-400 hover:bg-primary-500 transition-colors no-underline text-base"
              >
                Postavi oglas besplatno
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
              <div className="bg-primary-50 text-primary-600 p-3 rounded-xl">
                <Icon size={24} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 m-0">{value}</p>
                <p className="text-sm text-gray-500 m-0">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Brands */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popularne marke</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {popularBrands.map((brand) => (
            <Link
              key={brand}
              to={`/automobili?brand=${brand}`}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center text-sm font-medium text-gray-700 hover:border-primary-300 hover:text-primary-600 hover:shadow-sm transition-all no-underline text-center"
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Cars */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 m-0">Istaknuti oglasi</h2>
              <p className="text-gray-500 mt-1 m-0">Najnoviji automobili na prodaju</p>
            </div>
            <Link to="/automobili" className="text-primary-600 hover:text-primary-700 font-medium text-sm no-underline flex items-center gap-1">
              Pogledaj sve <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 size={32} className="animate-spin text-primary-600" />
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <AlertTriangle size={48} className="text-amber-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Greška pri učitavanju vozila</h3>
              <p className="text-gray-500 text-sm">Pokušajte ponovo kasnije ili osvežite stranicu</p>
            </div>
          ) : featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Car size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Još nema oglasa</h3>
              <p className="text-gray-500 text-sm mb-4">Budite prvi koji će postaviti oglas!</p>
              <Link to="/novi-oglas" className="text-primary-600 font-medium no-underline hover:text-primary-700">
                Postavi oglas
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900">Zašto MojPolovnjak?</h2>
          <p className="text-gray-500 mt-2">Sve što vam je potrebno za kupovinu ili prodaju automobila</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl mb-4">
                <Icon size={28} />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Prodajete automobil?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
            Postavite oglas besplatno i dođite do hiljada potencijalnih kupaca.
          </p>
          <Link
            to="/novi-oglas"
            className="inline-flex items-center gap-2 bg-white text-primary-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-primary-50 transition-colors no-underline"
          >
            Postavi oglas <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  )
}
