import {
  Navigate
} from 'react-router-dom'

import {

  clearSession,
  getSession,
  isSessionValid,
  getCurrentUser

} from '../services/auth'

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({

  children,

  allowedRoles = []

}) {

  // ===================================================
  // SESSION CHECK
  // ===================================================

  const session =
    getSession()

  const valid =
    isSessionValid()

  // ===================================================
  // INVALID SESSION
  // ===================================================

  if (!session || !valid) {

    clearSession()

    return (

      <Navigate

        to="/login"

        replace

        state={{
          expired: Boolean(session)
        }}
      />
    )
  }

  // ===================================================
  // CURRENT USER
  // ===================================================

  const user =
    getCurrentUser()

  // ===================================================
  // USER ROLE
  // ===================================================

  const role =
    user?.group || 'user'

  // ===================================================
  // ROLE BASED ACCESS
  // ===================================================

  if (

    allowedRoles.length > 0 &&

    !allowedRoles.includes(role)

  ) {

    // ===============================================
    // ADMIN REDIRECT
    // ===============================================

    if (role === 'admin') {

      return (

        <Navigate

          to="/admin"

          replace
        />
      )
    }

    // ===============================================
    // USER REDIRECT
    // ===============================================

    return (

      <Navigate

        to="/home"

        replace
      />
    )
  }

  // ===================================================
  // ACCESS GRANTED
  // ===================================================

  return children
}

export default ProtectedRoute