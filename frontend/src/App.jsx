import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import CarListing from './pages/CarListing'
import CarDetail from './pages/CarDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import MyListings from './pages/MyListings'
import Favorites from './pages/Favorites'
import CreateListing from './pages/CreateListing'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/automobili" element={<CarListing />} />
          <Route path="/automobili/:id" element={<CarDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registracija" element={<Register />} />
          <Route path="/profil" element={<Profile />} />
          <Route path="/moji-oglasi" element={<MyListings />} />
          <Route path="/favoriti" element={<Favorites />} />
          <Route path="/novi-oglas" element={<CreateListing />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
