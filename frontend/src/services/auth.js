const SESSION_KEY = 'auth_session'
const TOKEN_KEY = 'token'

// =============================================
// SESSION TIMEOUT
// =============================================

// 15 Minutes

const SESSION_TIMEOUT =
  15 * 60 * 1000

// =============================================
// SET SESSION
// =============================================

export function setSession(data) {

  const sessionData = {

    user: {

      id:

        data.user?.id ||

        data.id ||

        null,

      name:

        data.user?.name ||

        data.name ||

        `${

          data.user?.first_name ||

          data.first_name ||

          ''

        } ${

          data.user?.last_name ||

          data.last_name ||

          ''

        }`.trim(),

      first_name:

        data.user?.first_name ||

        data.first_name ||

        '',

      last_name:

        data.user?.last_name ||

        data.last_name ||

        '',

      email:

        data.user?.email ||

        data.email ||

        '',

      mobile:

        data.user?.mobile ||

        data.mobile ||

        '',

      // =====================================
      // ROLE / GROUP
      // =====================================

      group:

        data.user?.group ||

        data.group ||

        'user'
    },

    hiddenAt: null
  }

  // =========================================
  // SAVE SESSION
  // =========================================

  localStorage.setItem(

    SESSION_KEY,

    JSON.stringify(sessionData)
  )

  // =========================================
  // SAVE JWT TOKEN
  // =========================================

  if (data.token) {

    localStorage.setItem(
      TOKEN_KEY,
      data.token
    )
  }

  // =========================================
  // DISPATCH EVENT
  // =========================================

  window.dispatchEvent(
    new Event('auth-changed')
  )
}

// =============================================
// GET TOKEN
// =============================================

export function getToken() {

  return localStorage.getItem(
    TOKEN_KEY
  )
}

// =============================================
// GET SESSION
// =============================================

export function getSession() {

  const stored =

    localStorage.getItem(
      SESSION_KEY
    )

  if (!stored) {

    return null
  }

  try {

    return JSON.parse(stored)

  } catch {

    return null
  }
}

// =============================================
// GET CURRENT USER
// =============================================

export function getCurrentUser() {

  const session =
    getSession()

  if (!session) {

    return null
  }

  return session.user
}

// =============================================
// GET USER ROLE
// =============================================

export function getUserRole() {

  const user =
    getCurrentUser()

  return (
    user?.group || 'user'
  )
}

// =============================================
// IS ADMIN
// =============================================

export function isAdmin() {

  return (
    getUserRole() === 'admin'
  )
}

// =============================================
// IS USER
// =============================================

export function isUser() {

  return (
    getUserRole() === 'user'
  )
}

// =============================================
// CHECK SESSION VALID
// =============================================

export function isSessionValid() {

  const session =
    getSession()

  const token =
    getToken()

  // =========================================
  // NO SESSION / TOKEN
  // =========================================

  if (!session || !token) {

    return false
  }

  // =========================================
  // CHECK INACTIVE TIME
  // =========================================

  if (session.hiddenAt) {

    const currentTime =
      Date.now()

    const inactiveTime =

      currentTime -
      session.hiddenAt

    // =====================================
    // SESSION EXPIRED
    // =====================================

    if (
      inactiveTime >
      SESSION_TIMEOUT
    ) {

      clearSession()

      return false
    }
  }

  return true
}

// =============================================
// HANDLE TAB CHANGE
// =============================================

function handleVisibilityChange() {

  const session =
    getSession()

  if (!session) return

  // =========================================
  // USER LEFT TAB
  // =========================================

  if (document.hidden) {

    session.hiddenAt =
      Date.now()

    localStorage.setItem(

      SESSION_KEY,

      JSON.stringify(session)
    )
  }

  // =========================================
  // USER RETURNED
  // =========================================

  else {

    const currentTime =
      Date.now()

    if (session.hiddenAt) {

      const inactiveTime =

        currentTime -
        session.hiddenAt

      // =====================================
      // SESSION EXPIRED
      // =====================================

      if (
        inactiveTime >
        SESSION_TIMEOUT
      ) {

        clearSession()

        window.location.href =
          '/login'

        return
      }
    }

    // RESET TIMER

    session.hiddenAt = null

    localStorage.setItem(

      SESSION_KEY,

      JSON.stringify(session)
    )
  }
}

// =============================================
// START SESSION TRACKING
// =============================================

export function startSessionTracking() {

  document.removeEventListener(

    'visibilitychange',

    handleVisibilityChange
  )

  document.addEventListener(

    'visibilitychange',

    handleVisibilityChange
  )
}

// =============================================
// CLEAR SESSION
// =============================================

export function clearSession() {

  localStorage.removeItem(
    SESSION_KEY
  )

  localStorage.removeItem(
    TOKEN_KEY
  )

  localStorage.removeItem(
    'pending_mobile'
  )

  window.dispatchEvent(
    new Event('auth-changed')
  )
}

// =============================================
// LOGOUT
// =============================================

export function logout() {

  clearSession()

  window.location.href =
    '/login'
}