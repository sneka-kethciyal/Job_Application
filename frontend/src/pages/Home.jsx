import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  isSessionValid,
  getCurrentUser,
  logout,
  startSessionTracking
} from '../services/auth'

import '../styles/home.css'

function Home() {

  const navigate = useNavigate()

  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [showProfile, setShowProfile] = useState(false)

  // ================================
  // SESSION CHECK
  // ================================
  useEffect(() => {

    startSessionTracking()

    const checkSession = () => {

      const valid = isSessionValid()

      if (!valid) {
        setLoggedIn(false)
        setUser(null)
        return
      }

      const currentUser = getCurrentUser()

      if (currentUser) {
        setLoggedIn(true)
        setUser(currentUser)
      } else {
        setLoggedIn(false)
        setUser(null)
      }
    }

    checkSession()

    const interval = setInterval(checkSession, 3000)

    return () => clearInterval(interval)

  }, [])

  // ================================
  // LOGOUT
  // ================================
  const handleLogout = () => {
    logout()
    setLoggedIn(false)
    setUser(null)
    setShowProfile(false)
    navigate('/login')
  }

  // ================================
  // UI
  // ================================
  return (
    <div className="home-page">

      {/* TOP BAR */}
      <div className="top-bar">

        <div className="brand-title">
          Application Portal
        </div>

        {/* LOGIN / PROFILE */}
        {!loggedIn ? (

          <button
            className="login-btn"
            onClick={() => navigate('/login')}
          >
            Login
          </button>

        ) : (

          <div className="profile-section">

            {/* PROFILE ICON */}
            <button
              className="profile-icon"
              onClick={() => setShowProfile(!showProfile)}
            >
              👤
            </button>

            {/* DROPDOWN */}
            {showProfile && (

              <div className="profile-dropdown">

                <h3>User Details</h3>

                <p>
                  <strong>Name:</strong>{' '}
                  {user?.first_name || user?.last_name
                    ? `${user?.first_name || ''} ${user?.last_name || ''}`
                    : user?.name || 'User'}
                </p>

                <p>
                  <strong>Email:</strong>{' '}
                  {user?.email || 'Not Available'}
                </p>

                <p>
                  <strong>Mobile:</strong>{' '}
                  {user?.mobile || 'Not Available'}
                </p>

                {/* LOGOUT */}
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>
            )}

          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="home-content">

        <h1>Welcome to Application Portal</h1>

        {loggedIn && user && (
          <div className="user-section">

  

            <button
              className="upload-btn"
              onClick={() => navigate('/application')}
            >
              Open Application Form
            </button>

          </div>
        )}

      </div>
    </div>
  )
}

export default Home