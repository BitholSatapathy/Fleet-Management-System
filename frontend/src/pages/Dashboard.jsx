import { useEffect, useState } from 'react'
import api from '../services/api'

const Dashboard = () => {
  const [status, setStatus] = useState('')
  const [project, setProject] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await api.get('/status')
        setStatus(response.data.status)
        setProject(response.data.project)
      } catch (requestError) {
        setError('Failed to connect to backend.')
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
  }, [])

  return (
    <main className="dashboard">
      <h1>Backend Status</h1>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div className="status-block">
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            <strong>Project:</strong> {project}
          </p>
        </div>
      )}
    </main>
  )
}

export default Dashboard
