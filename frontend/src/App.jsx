import {

  BrowserRouter,
  Routes,
  Route,
  Navigate

} from 'react-router-dom'

// =====================================================
// PAGES
// =====================================================

import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ApplicationForm from './pages/ApplicationForm'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'

// =====================================================
// PROTECTED ROUTE
// =====================================================

import ProtectedRoute from './components/ProtectedRoute'

// =====================================================
// STYLES
// =====================================================

import './styles/App.css'

// =====================================================
// APP
// =====================================================

function App() {

  return (

    <BrowserRouter>

      <div className="app">

        <Routes>

          {/* ========================================= */}
          {/* DEFAULT */}
          {/* ========================================= */}

          <Route
            path="/"
            element={
              <Navigate
                to="/home"
                replace
              />
            }
          />

          {/* ========================================= */}
          {/* PUBLIC HOME */}
          {/* ========================================= */}

          <Route
            path="/home"
            element={<Home />}
          />

          {/* ========================================= */}
          {/* AUTH */}
          {/* ========================================= */}

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/forgot-password"
            element={<ForgotPassword />}
          />

          {/* ========================================= */}
          {/* PROFILE */}
          {/* ========================================= */}

         <Route
  path="/profile"
  element={<Profile />}
/>
          
          

          {/* ========================================= */}
          {/* APPLICATION */}
          {/* ========================================= */}

          <Route
            path="/application"
            element={

              <ProtectedRoute>

                <ApplicationForm />

              </ProtectedRoute>
            }
          />

          {/* ========================================= */}
          {/* ADMIN DASHBOARD */}
          {/* ========================================= */}

          <Route
            path="/admin"
            element={

              <ProtectedRoute>

                <AdminDashboard />

              </ProtectedRoute>
            }
          />

          {/* ========================================= */}
          {/* 404 */}
          {/* ========================================= */}

          <Route
            path="*"
            element={
              <Navigate
                to="/home"
                replace
              />
            }
          />

        </Routes>

      </div>

    </BrowserRouter>
  )
}

export default App