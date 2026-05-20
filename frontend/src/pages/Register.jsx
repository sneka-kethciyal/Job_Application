import {

  useState,
  useEffect

} from 'react'

import {
  useNavigate
} from 'react-router-dom'

import {

  sendOtp,
  verifyOtp

} from '../services/api'

import {

  isSessionValid

} from '../services/auth'

import '../styles/register.css'

// =====================================================
// CONSTANTS
// =====================================================

const MOBILE_REGEX =
  /^\d{10}$/

// =====================================================
// COMPONENT
// =====================================================

function Register() {

  const navigate =
    useNavigate()

  // ===================================================
  // STATES
  // ===================================================

  const [mobile, setMobile] =
    useState('')

  const [otp, setOtp] =
    useState('')

  const [otpSent, setOtpSent] =
    useState(false)

  const [loading, setLoading] =
    useState(false)

  const [message, setMessage] =
    useState('')

  const [error, setError] =
    useState('')

  // ===================================================
  // CHECK SESSION
  // ===================================================

  useEffect(() => {

    if (isSessionValid()) {

      navigate('/home')
    }

  }, [navigate])

  // ===================================================
  // SEND OTP
  // ===================================================

  const handleSendOtp =
    async (event) => {

      event.preventDefault()

      setError('')
      setMessage('')

      // ===============================================
      // VALIDATE MOBILE
      // ===============================================

      if (
        !MOBILE_REGEX.test(mobile)
      ) {

        setError(
          'Please enter a valid 10-digit mobile number.'
        )

        return
      }

      try {

        setLoading(true)

        const response =
          await sendOtp(mobile)

        // =============================================
        // SUCCESS
        // =============================================

        if (response.success) {

          setOtpSent(true)

          setMessage(
            'OTP sent successfully. Use 1234 to verify.'
          )

        } else {

          setError(
            response.message ||
            'Unable to send OTP'
          )
        }

      } catch (err) {

        console.error(err)

        setError(

          err.response?.data?.message ||

          err.message ||

          'Unable to send OTP. Try again.'
        )

      } finally {

        setLoading(false)
      }
    }

  // ===================================================
  // VERIFY OTP
  // ===================================================

  const handleVerifyOtp =
    async (event) => {

      event.preventDefault()

      setError('')
      setMessage('')

      // ===============================================
      // VALIDATE OTP
      // ===============================================

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

            action:
              'register'
          })

        // =============================================
        // SUCCESS
        // =============================================

        if (response.success) {

          // SAVE TEMP MOBILE

          localStorage.setItem(

            'pending_mobile',

            mobile
          )

          setMessage(
            'OTP verified successfully'
          )

          // GO PROFILE PAGE

          navigate('/profile')

        } else {

          setError(
            response.message ||
            'OTP verification failed'
          )
        }

      } catch (err) {

        console.error(err)

        setError(

          err.response?.data?.message ||

          'OTP verification failed'
        )

      } finally {

        setLoading(false)
      }
    }

  // ===================================================
  // UI
  // ===================================================

  return (

    <div className="page-shell">

      <div className="form-card">

        {/* TITLE */}

        <h1>
          Register
        </h1>

        {/* SUBTITLE */}

        <p className="page-subtitle">

          Enter your mobile number
          to receive OTP

        </p>

        {/* FORM */}

        <form

          onSubmit={
            otpSent
              ? handleVerifyOtp
              : handleSendOtp
          }
        >

          {/* MOBILE */}

          <div className="form-group">

            <label htmlFor="mobile">

              Mobile Number

            </label>

            <input

              id="mobile"

              type="tel"

              value={mobile}

              onChange={(event) =>
                setMobile(
                  event.target.value
                )
              }

              placeholder="Enter 10-digit mobile"

              maxLength={10}
            />

          </div>

          {/* OTP */}

          {otpSent && (

            <div className="form-group">

              <label htmlFor="otp">

                OTP

              </label>

              <input

                id="otp"

                type="text"

                value={otp}

                onChange={(event) =>
                  setOtp(
                    event.target.value
                  )
                }

                placeholder="Enter OTP"

                maxLength={4}
              />

            </div>
          )}

          {/* SUCCESS */}

          {message && (

            <div className="alert success">

              {message}

            </div>
          )}

          {/* ERROR */}

          {error && (

            <div className="alert error">

              {error}

            </div>
          )}

          {/* BUTTON */}

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

        {/* FOOTER */}

        <div className="page-footer">

          Already have an account?

          {' '}

          <button

            onClick={() =>
              navigate('/login')
            }

            className="link-button"
          >
            Login
          </button>

        </div>

      </div>

    </div>
  )
}

export default Register