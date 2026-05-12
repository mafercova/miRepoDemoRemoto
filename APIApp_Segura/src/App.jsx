import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import SecureRoute from './components/SecureRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import Filtrar from './pages/Filtrar'
import PokemonDetail from './pages/PokemonDetail'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<SecureRoute><Home /></SecureRoute>} />
          <Route path="/filtrar" element={<SecureRoute><Filtrar /></SecureRoute>} />
          <Route path="/detalles/:id" element={<SecureRoute><PokemonDetail /></SecureRoute>} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </>
  )
}
