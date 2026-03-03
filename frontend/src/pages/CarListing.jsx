import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, ArrowUpDown, Loader2, AlertTriangle } from 'lucide-react'
import CarCard from '../components/cars/CarCard'
import FilterSidebar from '../components/cars/FilterSidebar'
import SearchBar from '../components/cars/SearchBar'
import { carsAPI } from '../services/api'
import { normalizeCars } from '../utils/normalize'

const emptyFilters = {
  brand: '',
  priceMin: '',
  priceMax: '',
  yearMin: '',
  yearMax: '',
  fuel: '',
  transmission: '',
  bodyType: '',
  location: '',
  mileageMin: '',
  mileageMax: '',
}

const sortOptions = [
  { value: 'newest', label: 'Najnovije' },
  { value: 'price_asc', label: 'Cena: rastuće' },
  { value: 'price_desc', label: 'Cena: opadajuće' },
  { value: 'year_desc', label: 'Godište: najnovije' },
  { value: 'mileage_asc', label: 'Kilometraža: najniža' },
]

export default function CarListing() {
  const [searchParams] = useSearchParams()
  const initialBrand = searchParams.get('brand') || ''

  const [filters, setFilters] = useState({ ...emptyFilters, brand: initialBrand })
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [mobileFilters, setMobileFilters] = useState(false)
  const [cars, setCars] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [hasNext, setHasNext] = useState(false)

  const fetchCars = useCallback(async () => {
    setLoading(true)
    setError(false)
    try {
      const params = { page, page_size: 12, sort, search: search || undefined }
      if (filters.brand) params.brand = filters.brand
      if (filters.fuel) params.fuel = filters.fuel
      if (filters.transmission) params.transmission = filters.transmission
      if (filters.bodyType) params.body_type = filters.bodyType
      if (filters.location) params.location = filters.location
      if (filters.priceMin) params.price_min = filters.priceMin
      if (filters.priceMax) params.price_max = filters.priceMax
      if (filters.yearMin) params.year_min = filters.yearMin
      if (filters.yearMax) params.year_max = filters.yearMax
      if (filters.mileageMin) params.mileage_min = filters.mileageMin
      if (filters.mileageMax) params.mileage_max = filters.mileageMax

      const res = await carsAPI.list(params)
      setCars(normalizeCars(res.data.cars))
      setTotal(res.data.total)
      setHasNext(res.data.has_next)
    } catch {
      setCars([])
      setTotal(0)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [filters, search, sort, page])

  useEffect(() => {
    setPage(1)
  }, [filters, search, sort])

  useEffect(() => {
    fetchCars()
  }, [fetchCars])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Automobili</h1>
        <p className="text-gray-500 text-sm">{total} rezultata</p>
      </div>

      <div className="flex gap-6">
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onReset={() => setFilters({ ...emptyFilters })}
          mobileOpen={mobileFilters}
          onMobileClose={() => setMobileFilters(false)}
        />

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
              >
                <SlidersHorizontal size={16} />
                Filteri
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:border-primary-500"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 size={32} className="animate-spin text-primary-600" />
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <AlertTriangle size={48} className="text-amber-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Greška pri učitavanju vozila</h3>
              <p className="text-gray-500 text-sm mb-4">Server trenutno nije dostupan. Pokušajte ponovo.</p>
              <button onClick={fetchCars} className="text-primary-600 font-medium text-sm bg-transparent border-0 cursor-pointer hover:text-primary-700">
                Pokušaj ponovo
              </button>
            </div>
          ) : cars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {cars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              {(hasNext || page > 1) && (
                <div className="flex justify-center gap-3 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm disabled:opacity-50 cursor-pointer hover:bg-gray-50"
                  >
                    Prethodna
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-600">Strana {page}</span>
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!hasNext}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm disabled:opacity-50 cursor-pointer hover:bg-gray-50"
                  >
                    Sledeća
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUpDown size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nema rezultata</h3>
              <p className="text-gray-500 text-sm mb-4">Pokušajte sa drugim filterima ili pretragom</p>
              <button
                onClick={() => { setFilters({ ...emptyFilters }); setSearch('') }}
                className="text-primary-600 font-medium text-sm bg-transparent border-0 cursor-pointer hover:text-primary-700"
              >
                Resetuj sve filtere
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
