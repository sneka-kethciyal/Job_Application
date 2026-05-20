import { useState, useEffect } from 'react'

import {
  useNavigate,
  useLocation
} from 'react-router-dom'

import {

  loginMobile,
  verifyOtp,
  loginEmail

} from '../services/api'

import {

  isSessionValid,
  setSession,
  getCurrentUser

} from '../services/auth'

import '../styles/login.css'

const MOBILE_REGEX =
  /^\d{10}$/

function Login() {

  const navigate =
    useNavigate()

  const location =
    useLocation()

  // ====================================================
  // STATES
  // ====================================================

  const [loginMethod,
    setLoginMethod] =
      useState('mobile')

  const [mobile,
    setMobile] =
      useState('')

  const [otp,
    setOtp] =
      useState('')

  const [otpSent,
    setOtpSent] =
      useState(false)

  const [email,
    setEmail] =
      useState('')

  const [password,
    setPassword] =
      useState('')

  const [loading,
    setLoading] =
      useState(false)

  const [message,
    setMessage] =
      useState(

        location.state?.expired

          ? 'Session expired. Please login again.'

          : null
      )

  const [error,
    setError] =
      useState(null)

  // ====================================================
  // CHECK SESSION
  // ====================================================

  useEffect(() => {

    if (isSessionValid()) {

      const user =
        getCurrentUser()

      // ADMIN

      if (
        user?.group === 'admin'
      ) {

        navigate('/admin')
      }

      // NORMAL USER

      else {

        navigate('/home')
      }
    }

  }, [navigate])

  // ====================================================
  // SEND OTP
  // ====================================================

  const handleSendOtp =
    async (event) => {

      event.preventDefault()

      setError(null)
      setMessage(null)

      // VALIDATION

      if (
        !MOBILE_REGEX.test(mobile)
      ) {

        setError(
          'Please enter valid 10 digit mobile number.'
        )

        return
      }

      try {

        setLoading(true)

        const response =
          await loginMobile(mobile)

        if (response.success) {

          setOtpSent(true)

          setMessage(
            'OTP sent successfully. Use 1234.'
          )
        }

      } catch (err) {

        setError(

          err.response?.data?.message ||

          'Unable to send OTP.'
        )

      } finally {

        setLoading(false)
      }
    }

  // ====================================================
  // VERIFY OTP
  // ====================================================

  const handleVerifyOtp =
    async (event) => {

      event.preventDefault()

      setError(null)
      setMessage(null)

      if (!otp) {

        setError(
          'Please enter OTP'
        )

        return
      }

      try {

        setLoading(true)

        const response =
          await verifyOtp({

            mobile,
            otp,

            action: 'login'
          })

        // ============================================
        // LOGIN SUCCESS
        // ============================================

        if (
          response.success &&
          response.user
        ) {

          // SAVE FULL RESPONSE

          setSession(response)

          // ADMIN

          if (
            response.user.group ===
            'admin'
          ) {

            navigate('/admin')
          }

          // NORMAL USER

          else {

            navigate('/home')
          }
        }

        else {

          setError(
            response.message ||
            'Login failed'
          )
        }

      } catch (err) {

        setError(

          err.response?.data?.message ||

          'OTP verification failed.'
        )

      } finally {

        setLoading(false)
      }
    }

  // ====================================================
  // EMAIL LOGIN
  // ====================================================

  const handleEmailLogin =
    async (event) => {

      event.preventDefault()

      setError(null)
      setMessage(null)

      if (
        !email ||
        !password
      ) {

        setError(
          'Email and password required.'
        )

        return
      }

      try {

        setLoading(true)

        const response =
          await loginEmail({

            email,
            password
          })

        // ============================================
        // LOGIN SUCCESS
        // ============================================

        if (
          response.success &&
          response.user
        ) {

          // SAVE FULL RESPONSE

          setSession(response)

          // ADMIN

          if (
            response.user.group ===
            'admin'
          ) {

            navigate('/admin')
          }

          // USER

          else {

            navigate('/home')
          }
        }

      } catch (err) {

        setError(

          err.response?.data?.message ||

          'Invalid email or password.'
        )

      } finally {

        setLoading(false)
      }
    }

  return (

    <div className="page-shell">

      <div className="login-card">

        <h1>Login</h1>

        <p className="page-subtitle">
          Choose your login method
        </p>

        {/* ========================================= */}
        {/* LOGIN METHOD */}
        {/* ========================================= */}

        <div className="method-switch">

          <button

            type="button"

            className={

              loginMethod === 'mobile'

                ? 'method active'

                : 'method'
            }

            onClick={() => {

              setLoginMethod('mobile')

              setError(null)
              setMessage(null)
            }}
          >

            Mobile OTP

          </button>

          <button

            type="button"

            className={

              loginMethod === 'email'

                ? 'method active'

                : 'method'
            }

            onClick={() => {

              setLoginMethod('email')

              setError(null)
              setMessage(null)
            }}
          >

            Email Login

          </button>

        </div>

        {/* ========================================= */}
        {/* MOBILE LOGIN */}
        {/* ========================================= */}

        {

          loginMethod === 'mobile'

            ? (

              <form
                onSubmit={
                  otpSent

                    ? handleVerifyOtp

                    : handleSendOtp
                }
              >

                <div className="form-group">

                  <label>
                    Mobile Number
                  </label>

                  <input

                    type="tel"

                    value={mobile}

                    onChange={(e) =>
                      setMobile(e.target.value)
                    }

                    placeholder="Enter mobile"

                    maxLength={10}
                  />

                </div>

                {

                  otpSent && (

                    <div className="form-group">

                      <label>
                        OTP
                      </label>

                      <input

                        type="text"

                        value={otp}

                        onChange={(e) =>
                          setOtp(e.target.value)
                        }

                        placeholder="Enter OTP"

                        maxLength={4}
                      />

                    </div>
                  )
                }

                {

                  message && (

                    <div className="alert success">
                      {message}
                    </div>
                  )
                }

                {

                  error && (

                    <div className="alert error">
                      {error}
                    </div>
                  )
                }

                <button

                  className="btn primary"

                  type="submit"

                  disabled={loading}
                >

                  {

                    loading

                      ? 'Processing...'

                      : otpSent

                        ? 'Verify OTP'

                        : 'Send OTP'
                  }

                </button>

              </form>

            )

            : (

              // =====================================
              // EMAIL LOGIN
              // =====================================

              <form
                onSubmit={
                  handleEmailLogin
                }
              >

                <div className="form-group">

                  <label>Email</label>

                  <input

                    type="email"

                    value={email}

                    onChange={(e) =>
                      setEmail(e.target.value)
                    }

                    placeholder="Enter email"
                  />

                </div>

                <div className="form-group">

                  <label>Password</label>

                  <input

                    type="password"

                    value={password}

                    onChange={(e) =>
                      setPassword(e.target.value)
                    }

                    placeholder="Enter password"
                  />

                </div>

                {

                  message && (

                    <div className="alert success">
                      {message}
                    </div>
                  )
                }

                {

                  error && (

                    <div className="alert error">
                      {error}
                    </div>
                  )
                }

                <button

                  className="btn primary"

                  type="submit"

                  disabled={loading}
                >

                  {

                    loading

                      ? 'Checking...'

                      : 'Login'
                  }

                </button>

              </form>
            )
        }

        {/* ========================================= */}
        {/* FOOTER */}
        {/* ========================================= */}

        <div className="page-footer">

          <button

            type="button"

            className="link-button"

            onClick={() =>
              navigate('/forgot-password')
            }
          >

            Forgot Password?

          </button>

          <br />
          <br />

          New user?{' '}

          <button

            type="button"

            className="link-button"

            onClick={() =>
              navigate('/register')
            }
          >

            Register

          </button>

        </div>

      </div>

    </div>
  )
}

export default Login