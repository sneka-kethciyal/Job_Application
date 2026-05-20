import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearSession, getSession, isSessionValid } from '../utils/auth'
import '../styles/navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const updateStatus = () => {
      const session = getSession()
      setLoggedIn(Boolean(session && isSessionValid()))
    }

    updateStatus()
    window.addEventListener('auth-changed', updateStatus)
    return () => window.removeEventListener('auth-changed', updateStatus)
  }, [])

  const handleLogout = () => {
    clearSession()
    navigate('/login')
  }

  return (
    <header className="navbar-shell">
      <div className="navbar-container">
        <Link to="/" className="brand">Auth & Form System</Link>
        <nav className="nav-links">
          {!loggedIn && (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
          {loggedIn && (
            <>
              <Link to="/application">Application</Link>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
