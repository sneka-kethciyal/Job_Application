import { useState, useEffect } from 'react'

import { useNavigate } from 'react-router-dom'

import { saveProfile } from '../services/api'

import {

  isSessionValid,

  setSession,

  startSessionTracking

} from '../services/auth'

import '../styles/profile.css'

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Profile() {

  const navigate = useNavigate()

  const [firstName, setFirstName] =
    useState('')

  const [lastName, setLastName] =
    useState('')

  const [dob, setDob] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [mobile, setMobile] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState('')

  const [message, setMessage] =
    useState('')

  // =========================================
  // PAGE LOAD
  // =========================================

  useEffect(() => {

    if (isSessionValid()) {

      navigate('/application')

      return
    }

    const pendingMobile =

      localStorage.getItem(
        'pending_mobile'
      )

    if (!pendingMobile) {

      navigate('/register')

    } else {

      setMobile(pendingMobile)
    }

  }, [navigate])

  // =========================================
  // SUBMIT
  // =========================================

  const handleSubmit = async (event) => {

    event.preventDefault()

    setError('')

    setMessage('')

    // =====================================
    // VALIDATION
    // =====================================

    if (

      !firstName ||

      !lastName ||

      !dob ||

      !email ||

      !password

    ) {

      setError(
        'All fields are required.'
      )

      return
    }

    if (!EMAIL_REGEX.test(email)) {

      setError(
        'Please enter valid email.'
      )

      return
    }

    if (password.length < 6) {

      setError(
        'Password must be at least 6 characters.'
      )

      return
    }

    try {

      setLoading(true)

      const response =
        await saveProfile({

          first_name: firstName,

          last_name: lastName,

          dob: dob,

          email: email,

          password: password,

          mobile: mobile
        })

      console.log(response)

      // =====================================
      // SUCCESS
      // =====================================

      if (response.success) {

        // SAVE SESSION

        setSession({

          first_name: firstName,

          last_name: lastName,

          name:
            `${firstName} ${lastName}`,

          email: email,

          mobile: mobile
        })

        // START SESSION TRACKER

        startSessionTracking()

        // REMOVE TEMP MOBILE

        localStorage.removeItem(
          'pending_mobile'
        )

        setMessage(
          response.message
        )

        // REDIRECT

        setTimeout(() => {

          navigate('/login')

        }, 1000)
      }

    } catch (err) {

      console.log(err)

      setError(

        err.response?.data?.message ||

        'Failed to save profile.'
      )

    } finally {

      setLoading(false)
    }
  }

  // =========================================
  // UI
  // =========================================

  return (

    <div className="page-shell">

      <div className="profile-card">

        <h1>
          Complete Your Profile
        </h1>

        <p className="page-subtitle">

          Finish registration to continue.

        </p>

        <form onSubmit={handleSubmit}>

          {/* FIRST NAME */}

          <div className="form-group">

            <label>
              First Name
            </label>

            <input
              type="text"
              value={firstName}
              onChange={(e) =>
                setFirstName(
                  e.target.value
                )
              }
              placeholder="Enter first name"
            />

          </div>

          {/* LAST NAME */}

          <div className="form-group">

            <label>
              Last Name
            </label>

            <input
              type="text"
              value={lastName}
              onChange={(e) =>
                setLastName(
                  e.target.value
                )
              }
              placeholder="Enter last name"
            />

          </div>

          {/* DOB */}

          <div className="form-group">

            <label>
              Date of Birth
            </label>

            <input
              type="date"
              value={dob}
              onChange={(e) =>
                setDob(
                  e.target.value
                )
              }
            />

          </div>

          {/* EMAIL */}

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              placeholder="Enter email"
            />

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Create password"
            />

          </div>

          {/* MOBILE */}

          <div className="form-group">

            <label>
              Mobile Number
            </label>

            <input
              type="text"
              value={mobile}
              readOnly
            />

          </div>

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
            type="submit"
            className="btn primary"
            disabled={loading}
          >

            {

              loading

                ? 'Saving...'

                : 'Save Profile'
            }

          </button>

        </form>

      </div>

    </div>
  )
}

export default Profile