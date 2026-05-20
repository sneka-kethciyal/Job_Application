import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  getApplications,
  getUsers
} from '../services/api'

import {
  getCurrentUser,
  logout
} from '../services/auth'

import '../styles/admin.css'

function AdminDashboard() {

  const navigate = useNavigate()

  const [users, setUsers] = useState([])
  const [applications, setApplications] =
    useState([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const currentUser =
    getCurrentUser()

  // ======================================================
  // AUDIO
  // ======================================================

  const audioRef = useRef(null)

  const [playingId, setPlayingId] =
    useState(null)

  // ======================================================
  // TOKEN
  // ======================================================

  const getToken = () =>
    localStorage.getItem('token')

  // ======================================================
  // FILE NAME
  // ======================================================

  const getFilename = (path) => {

    if (!path) return ''

    return path.split('/').pop()
  }

  // ======================================================
  // SAFE TEXT
  // ======================================================

  const safeText = (value) => {

    if (!value) return ''

    if (typeof value === 'object') {

      return (
        value.text ||
        value.audio ||
        ''
      )
    }

    return value
  }

  // ======================================================
  // LOAD DATA
  // ======================================================

  useEffect(() => {

    fetchData()

  }, [])

  const fetchData = async () => {

    try {

      setLoading(true)

      setError('')

      const [
        usersRes,
        appRes
      ] = await Promise.all([

        getUsers(),

        getApplications()
      ])

      setUsers(

        usersRes?.success
          ? usersRes.data || []
          : []
      )

      setApplications(

        appRes?.success
          ? appRes.data || []
          : []
      )

    } catch (err) {

      console.error(err)

      setError(
        'Failed to load dashboard data'
      )

    } finally {

      setLoading(false)
    }
  }

  // ======================================================
  // VIEW RESUME
  // ======================================================

  const viewResume = async (
    resumePath
  ) => {

    try {

      const token =
        getToken()

      const filename =
        getFilename(resumePath)

      const res = await fetch(

        `http://127.0.0.1:5000/resume/${filename}`,

        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )

      if (!res.ok) {

        throw new Error(
          'Failed to load resume'
        )
      }

      const blob =
        await res.blob()

      const url =
        window.URL.createObjectURL(blob)

      window.open(url, '_blank')

      setTimeout(() => {

        URL.revokeObjectURL(url)

      }, 10000)

    } catch (err) {

      console.error(err)

      alert(
        'Unable to open resume'
      )
    }
  }

  // ======================================================
  // PLAY / STOP AUDIO
  // ======================================================

  const playAudio = async (
    audioPath,
    appId
  ) => {

    try {

      // STOP SAME AUDIO

      if (

        audioRef.current &&

        playingId === appId

      ) {

        audioRef.current.pause()

        audioRef.current.currentTime = 0

        audioRef.current = null

        setPlayingId(null)

        return
      }

      // STOP PREVIOUS AUDIO

      if (audioRef.current) {

        audioRef.current.pause()

        audioRef.current.currentTime = 0
      }

      const token =
        getToken()

      const filename =
        getFilename(audioPath)

      const res = await fetch(

        `http://127.0.0.1:5000/audio/${filename}`,

        {
          method: 'GET',

          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      )

      if (!res.ok) {

        throw new Error(
          'Audio fetch failed'
        )
      }

      const blob =
        await res.blob()

      const url =
        window.URL.createObjectURL(blob)

      const audio =
        new Audio(url)

      audioRef.current = audio

      setPlayingId(appId)

      audio.play()

      audio.onended = () => {

        setPlayingId(null)

        audioRef.current = null
      }

    } catch (err) {

      console.error(err)

      alert(
        'Unable to play audio'
      )
    }
  }

  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {

    if (audioRef.current) {

      audioRef.current.pause()

      audioRef.current = null
    }

    logout()

    navigate('/login')
  }

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="admin-page">

        <h2>
          Loading Dashboard...
        </h2>

      </div>
    )
  }

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="admin-page">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="admin-header">

        <div>

          <h1>
            Admin Dashboard
          </h1>

          <p>
            Welcome,
            {' '}
            {
              currentUser?.name ||
              'Admin'
            }
          </p>

        </div>

        <div className="admin-actions">

          <button
            className="form-btn"
            onClick={() =>
              navigate('/application')
            }
          >

            Open Application Form

          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            Logout

          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (

        <div className="admin-error">

          {error}

        </div>
      )}

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="stats-grid">

        <div className="stat-card">

          <h2>
            {users.length}
          </h2>

          <p>
            Total Users
          </p>

        </div>

        <div className="stat-card">

          <h2>
            {applications.length}
          </h2>

          <p>
            Applications
          </p>

        </div>

      </div>

      {/* ================================================= */}
      {/* USERS TABLE */}
      {/* ================================================= */}

      <div className="dashboard-section">

        <h2>
          Users
        </h2>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>Name</th>

                <th>Email</th>

                <th>Mobile</th>

                <th>Role</th>

              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr key={user.id}>

                  <td>

                    {safeText(user.first_name)}
                    {' '}
                    {safeText(user.last_name)}

                  </td>

                  <td>
                    {safeText(user.email)}
                  </td>

                  <td>
                    {safeText(user.mobile)}
                  </td>

                  <td>
                    {safeText(user.group)}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================================= */}
      {/* APPLICATIONS TABLE */}
      {/* ================================================= */}

      <div className="dashboard-section">

        <h2>
          Applications
        </h2>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>Name</th>

                <th>DOB</th>

                <th>Technology</th>

                <th>Resume</th>

                <th>
                  About Yourself Audio
                </th>

              </tr>

            </thead>

            <tbody>

              {applications.map((app) => {

                const aboutAudio =
                  app?.about_yourself?.audio

                return (

                  <tr key={app.id}>

                    <td>

                      {safeText(app.first_name)}
                      {' '}
                      {safeText(app.last_name)}

                    </td>

                    <td>

                      {safeText(app.dob)}

                    </td>

                    <td
                      style={{
                        minWidth: '250px',
                        whiteSpace: 'normal'
                      }}
                    >

                      {
                        safeText(
                          app.comfortable_technology
                        )
                      }

                    </td>

                    {/* RESUME */}

                    <td>

                      {app.resume_path ? (

                        <button
                          className="view-btn"
                          onClick={() =>
                            viewResume(
                              app.resume_path
                            )
                          }
                        >

                          View Resume

                        </button>

                      ) : (

                        'No Resume'
                      )}

                    </td>

                    {/* AUDIO */}

                    <td>

                      {aboutAudio ? (

                        <button
                          className="mic-btn"
                          onClick={() =>
                            playAudio(
                              aboutAudio,
                              app.id
                            )
                          }
                        >

                          {
                            playingId === app.id
                              ? '⏹️'
                              : '🎤'
                          }

                        </button>

                      ) : (

                        'No Audio'
                      )}

                    </td>

                  </tr>
                )
              })}

            </tbody>

          </table>

        </div>

      </div>

      {/* ================================================= */}
      {/* JOB APPLICATION OVERVIEW */}
      {/* ================================================= */}

      <div className="dashboard-section">

        <h2>
          Job Applications Overview
        </h2>

        <div className="table-wrapper">

          <table>

            <thead>

              <tr>

                <th>User Name</th>

                <th>Job Code</th>

                <th>Created At</th>

                <th>Updated At</th>

              </tr>

            </thead>

            <tbody>

              {applications.map((app) => (

                <tr key={app.id}>

                  <td>

                    {safeText(app.first_name)}
                    {' '}
                    {safeText(app.last_name)}

                  </td>

                  <td>

                    {safeText(app.job_code)}

                  </td>

                  <td>

                    {
                      app.created_at

                        ? new Date(
                            app.created_at
                          ).toLocaleString()

                        : 'N/A'
                    }

                  </td>

                  <td>

                    {
                      app.updated_at

                        ? new Date(
                            app.updated_at
                          ).toLocaleString()

                        : 'N/A'
                    }

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default AdminDashboard