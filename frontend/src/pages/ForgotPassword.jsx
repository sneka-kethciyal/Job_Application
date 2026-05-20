import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  resetPassword
} from '../services/api'

import '../styles/login.css'

function ForgotPassword() {

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {

    event.preventDefault()

    setError(null)
    setMessage(null)

    if (!email || !newPassword || !confirmPassword) {

      setError('All fields are required')

      return
    }

    if (newPassword.length < 6) {

      setError('Password must be minimum 6 characters')

      return
    }

    if (newPassword !== confirmPassword) {

      setError('Passwords do not match')

      return
    }

    try {

      setLoading(true)

      const response = await resetPassword({
        email,
        password: newPassword
      })

      if (response.success) {

        setMessage('Password updated successfully')

        setTimeout(() => {
          navigate('/login')
        }, 1500)
      }

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Password reset failed'
      )

    } finally {

      setLoading(false)
    }
  }

  return (

    <div className="page-shell">

      <div className="login-card">

        <h1>Forgot Password</h1>

        <p className="page-subtitle">
          Reset your password using registered email
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter registered email"
            />

          </div>

          <div className="form-group">

            <label>New Password</label>

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />

          </div>

          <div className="form-group">

            <label>Confirm Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />

          </div>

          {message && (
            <div className="alert success">
              {message}
            </div>
          )}

          {error && (
            <div className="alert error">
              {error}
            </div>
          )}

          <button
            className="btn primary"
            type="submit"
            disabled={loading}
          >
            {loading
              ? 'Updating...'
              : 'Reset Password'}
          </button>

        </form>

      </div>

    </div>
  )
}

export default ForgotPassword