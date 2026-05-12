import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/home" className="nav-brand">PokéApp</Link>
        {user && (
          <div className="nav-links">
            <Link to="/home">Home</Link>
            <Link to="/filtrar">Filtrar</Link>
          </div>
        )}
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">{user.username}</span>
            <button onClick={handleLogout} className="btn-logout">Cerrar sesión</button>
          </>
        ) : (
          <div className="nav-links">
            <Link to="/login">Iniciar sesión</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
