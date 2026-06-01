import axios from 'axios'

// ======================================================
// API URL
// ======================================================

const BASE_URL = import.meta.env.VITE_API_URL;

// ======================================================
// AXIOS INSTANCE
// ======================================================

const api = axios.create({

  baseURL: BASE_URL,

  headers: {
    'Content-Type': 'application/json',
  },
})

// ======================================================
// AUTO ATTACH JWT TOKEN
// ======================================================

api.interceptors.request.use(

  (config) => {

    const token =
      localStorage.getItem('token')

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`
    }

    return config
  },

  (error) => {

    return Promise.reject(error)
  }
)

// ======================================================
// HANDLE TOKEN EXPIRE
// ======================================================

api.interceptors.response.use(

  (response) => response,

  (error) => {

    // TOKEN EXPIRED

    if (
      error.response &&
      error.response.status === 401
    ) {

      localStorage.removeItem('token')

      localStorage.removeItem(
        'auth_session'
      )

      window.location.href =
        '/login'
    }

    return Promise.reject(error)
  }
)

export default api

// ======================================================
// AUTH APIs
// ======================================================

// SEND OTP

export const sendOtp = async (
  mobile
) => {

  const res = await api.post(
    '/send-otp',
    { mobile }
  )

  return res.data
}

// VERIFY OTP

export const verifyOtp = async (
  data
) => {

  const res = await api.post(
    '/verify-otp',
    data
  )

  return res.data
}

// MOBILE LOGIN

export const loginMobile =
  async (mobile) => {

    const res = await api.post(
      '/send-otp',
      { mobile }
    )

    return res.data
  }

// EMAIL LOGIN

export const loginEmail =
  async (data) => {

    const res = await api.post(
      '/login-email',
      data
    )

    return res.data
  }

// RESET PASSWORD

export const resetPassword =
  async (data) => {

    const response = await api.post(
      '/reset-password',
      data
    )

    return response.data
  }

// SAVE PROFILE

export const saveProfile =
  async (data) => {

    const res = await api.post(
      '/save-profile',
      data
    )

    return res.data
  }

// ======================================================
// APPLICATION APIs
// ======================================================

// SUBMIT APPLICATION

export const submitApplication =
  async (formData) => {

    const res = await api.post(

      '/submit-application',

      formData,

      {
        headers: {
          'Content-Type':
            'multipart/form-data',
        },
      }
    )

    return res.data
  }

// ======================================================
// ADMIN APIs
// ======================================================

// GET ALL USERS
// ADMIN ONLY

export const getUsers =
  async () => {

    const res = await api.get(
      '/users'
    )

    return res.data
  }

// GET SINGLE USER
// ADMIN ONLY

export const getSingleUser =
  async (userId) => {

    const res = await api.get(
      `/users/${userId}`
    )

    return res.data
  }

// GET APPLICATIONS
// ADMIN ONLY

export const getApplications =
  async () => {

    const res = await api.get(
      '/applications'
    )

    return res.data
  }

  // GET MY APPLICATIONS
// USER SAFE API

export const getMyApplications =
  async () => {

    const res = await api.get(
      '/my-applications'
    )

    return res.data
  }

// ======================================================
// RESUME APIs
// ======================================================

// ADMIN ONLY

// ======================================================
// AUDIO APIs
// ======================================================

// ======================================================
// ROLE HELPERS
// ======================================================

export const isAdmin = () => {

  const session = JSON.parse(
    localStorage.getItem(
      'auth_session'
    )
  )

  return (
    session?.user?.group ===
    'admin'
  )
}

export const isUser = () => {

  const session = JSON.parse(
    localStorage.getItem(
      'auth_session'
    )
  )

  return (
    session?.user?.group ===
    'user'
  )
}