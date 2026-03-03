import { Link } from 'react-router-dom'
import { Car, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 no-underline mb-4">
              <div className="bg-primary-600 text-white p-2 rounded-lg">
                <Car size={20} />
              </div>
              <span className="text-lg font-bold text-white">
                Moj<span className="text-primary-400">Polovnjak</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Vaše pouzdano mesto za kupovinu i prodaju polovnih automobila u Srbiji.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Brzi linkovi</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              <li><Link to="/automobili" className="text-gray-400 hover:text-white text-sm no-underline transition-colors">Svi automobili</Link></li>
              <li><Link to="/novi-oglas" className="text-gray-400 hover:text-white text-sm no-underline transition-colors">Postavi oglas</Link></li>
              <li><Link to="/registracija" className="text-gray-400 hover:text-white text-sm no-underline transition-colors">Registruj se</Link></li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h4 className="text-white font-semibold mb-4">Popularne marke</h4>
            <ul className="space-y-2 list-none p-0 m-0">
              {['BMW', 'Mercedes-Benz', 'Audi', 'Volkswagen', 'Toyota', 'Škoda'].map((brand) => (
                <li key={brand}>
                  <Link to={`/automobili?brand=${brand}`} className="text-gray-400 hover:text-white text-sm no-underline transition-colors">
                    {brand}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3 list-none p-0 m-0">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={16} className="text-primary-400 shrink-0" /> info@mojpolovnjak.autos
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone size={16} className="text-primary-400 shrink-0" /> +381 11 123 4567
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={16} className="text-primary-400 shrink-0" /> Beograd, Srbija
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 m-0">
            &copy; {new Date().getFullYear()} MojPolovnjak. Sva prava zadržana.
          </p>
          <div className="flex gap-6">
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-300 no-underline">Uslovi korišćenja</Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-gray-300 no-underline">Politika privatnosti</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
