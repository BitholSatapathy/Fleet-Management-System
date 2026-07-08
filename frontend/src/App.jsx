import { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import api from './services/api'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DriverPortal from './pages/DriverPortal'

const App = () => {
  const [status, setStatus] = useState('Loading server status...')
  const [project, setProject] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStatus = async () => {
      try {
        const response = await api.get('/status')
        setStatus(response.data.status)
        setProject(response.data.project)
      } catch (requestError) {
        setError('Could not reach the backend yet.')
      }
    }

    loadStatus()
  }, [])

  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="hero-card">
          <div>
            <p className="eyebrow">Phase 3</p>
            <h1>Frontend and backend are now connected.</h1>
            <p className="lede">
              The React app is fetching data from the Node.js API and rendering the result.
            </p>
          </div>

          <nav className="nav-links" aria-label="Primary">
            <Link to="/">Dashboard</Link>
            <Link to="/login">Login</Link>
            <Link to="/driver-portal">Driver Portal</Link>
          </nav>

          <section className="status-card" aria-live="polite">
            <p className="eyebrow">Backend Status</p>
            <h2>{status}</h2>
            <p className="muted">{project || 'Waiting for response from the API.'}</p>
            {error ? <p className="error-text">{error}</p> : null}
          </section>
        </header>

        <main className="content-area">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/driver-portal" element={<DriverPortal />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
