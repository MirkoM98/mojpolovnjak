import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Pretraži automobile...' }) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all"
      />
    </div>
  )
}
