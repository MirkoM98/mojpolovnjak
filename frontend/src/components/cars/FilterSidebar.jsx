import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react'
import { brands, fuelTypes, transmissions, bodyTypes, locations } from '../../data/mockCars'

const priceRanges = [
  { label: 'Do 5.000 €', min: 0, max: 5000 },
  { label: '5.000 - 10.000 €', min: 5000, max: 10000 },
  { label: '10.000 - 20.000 €', min: 10000, max: 20000 },
  { label: '20.000 - 30.000 €', min: 20000, max: 30000 },
  { label: '30.000 - 50.000 €', min: 30000, max: 50000 },
  { label: 'Preko 50.000 €', min: 50000, max: Infinity },
]

const currentYear = new Date().getFullYear()
const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i)

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left font-semibold text-gray-800 text-sm mb-2 bg-transparent border-0 cursor-pointer p-0"
      >
        {title}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && children}
    </div>
  )
}

export default function FilterSidebar({ filters, onFilterChange, onReset, mobileOpen, onMobileClose }) {
  const updateFilter = (key, value) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const activeCount = Object.values(filters).filter((v) => v !== '' && v !== null && v !== undefined).length

  const content = (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-primary-600" />
          <h3 className="font-bold text-gray-900 m-0">Filteri</h3>
          {activeCount > 0 && (
            <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-red-500 hover:text-red-700 bg-transparent border-0 cursor-pointer font-medium"
          >
            Resetuj
          </button>
        )}
      </div>

      {/* Brand */}
      <FilterSection title="Marka">
        <select
          value={filters.brand || ''}
          onChange={(e) => updateFilter('brand', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Sve marke</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </FilterSection>

      {/* Price */}
      <FilterSection title="Cena">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Od"
            value={filters.priceMin || ''}
            onChange={(e) => updateFilter('priceMin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Do"
            value={filters.priceMax || ''}
            onChange={(e) => updateFilter('priceMax', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </FilterSection>

      {/* Year */}
      <FilterSection title="Godište">
        <div className="flex gap-2">
          <select
            value={filters.yearMin || ''}
            onChange={(e) => updateFilter('yearMin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Od</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
          <select
            value={filters.yearMax || ''}
            onChange={(e) => updateFilter('yearMax', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Do</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </FilterSection>

      {/* Fuel */}
      <FilterSection title="Gorivo">
        <div className="flex flex-wrap gap-2">
          {fuelTypes.map((fuel) => (
            <button
              key={fuel}
              onClick={() => updateFilter('fuel', filters.fuel === fuel ? '' : fuel)}
              className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer transition-colors ${
                filters.fuel === fuel
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
              }`}
            >
              {fuel}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Transmission */}
      <FilterSection title="Menjač">
        <div className="flex flex-wrap gap-2">
          {transmissions.map((t) => (
            <button
              key={t}
              onClick={() => updateFilter('transmission', filters.transmission === t ? '' : t)}
              className={`px-3 py-1.5 rounded-lg text-sm border cursor-pointer transition-colors ${
                filters.transmission === t
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-primary-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Body Type */}
      <FilterSection title="Karoserija">
        <select
          value={filters.bodyType || ''}
          onChange={(e) => updateFilter('bodyType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Sve karoserije</option>
          {bodyTypes.map((bt) => (
            <option key={bt} value={bt}>{bt}</option>
          ))}
        </select>
      </FilterSection>

      {/* Location */}
      <FilterSection title="Lokacija" defaultOpen={false}>
        <select
          value={filters.location || ''}
          onChange={(e) => updateFilter('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Svi gradovi</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </FilterSection>

      {/* Mileage */}
      <FilterSection title="Kilometraža" defaultOpen={false}>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Od"
            value={filters.mileageMin || ''}
            onChange={(e) => updateFilter('mileageMin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <input
            type="number"
            placeholder="Do"
            value={filters.mileageMax || ''}
            onChange={(e) => updateFilter('mileageMax', e.target.value)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </FilterSection>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 p-5 sticky top-20">
          {content}
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={onMobileClose} />
          <div className="relative ml-auto w-80 max-w-[85vw] bg-white h-full overflow-y-auto p-5">
            <button
              onClick={onMobileClose}
              className="absolute top-4 right-4 p-1 bg-transparent border-0 cursor-pointer"
            >
              <X size={20} />
            </button>
            {content}
          </div>
        </div>
      )}
    </>
  )
}
