import { useEffect, useState } from 'react'
import { FaPenToSquare, FaTrashCan } from 'react-icons/fa6'
import api from '../services/api'

const statusClasses = {
  Available: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  'On Trip': 'bg-blue-50 text-blue-700 ring-blue-100',
  'On Leave': 'bg-amber-50 text-amber-700 ring-amber-100',
}

const DriverTable = ({ refreshToken, onEdit }) => {
  const [drivers, setDrivers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDrivers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/drivers')
      setDrivers(response.data)
      setError('')
    } catch (requestError) {
      setError('Failed to load drivers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDrivers()
  }, [refreshToken])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/drivers/${id}`)
      fetchDrivers()
    } catch (deleteError) {
      setError('Failed to delete driver.')
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
            Driver Directory
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Driver Table</h2>
        </div>
      </div>

      {loading ? <p className="text-slate-500">Loading...</p> : null}
      {error ? <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-sm uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">License</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Safety Score</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
              {drivers.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan="6">
                    No drivers found.
                  </td>
                </tr>
              ) : (
                drivers.map((driver) => (
                  <tr key={driver.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4 font-medium text-slate-900">{driver.name}</td>
                    <td className="px-4 py-4">{driver.phone}</td>
                    <td className="px-4 py-4">{driver.licenseNumber}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClasses[driver.status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}
                      >
                        {driver.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">{driver.safetyScore}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => onEdit(driver)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          <FaPenToSquare /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(driver.id)}
                          className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          <FaTrashCan /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : null}
    </section>
  )
}

export default DriverTable
