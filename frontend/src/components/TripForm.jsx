import { useEffect, useState } from 'react'
import api from '../services/api'

const initialForm = {
  vehicle: '',
  driver: '',
  source: '',
  destination: '',
  distance: '',
  status: 'Scheduled',
}

const TripForm = ({ editingTrip, onSaved, onCancelEdit }) => {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingTrip) {
      setFormData({
        vehicle: editingTrip.vehicle || '',
        driver: editingTrip.driver || '',
        source: editingTrip.source || '',
        destination: editingTrip.destination || '',
        distance: editingTrip.distance?.toString() || '',
        status: editingTrip.status || 'Scheduled',
      })
      setMessage('')
      setError('')
      return
    }

    setFormData(initialForm)
  }, [editingTrip])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const payload = {
        ...formData,
        distance: Number(formData.distance),
      }

      if (editingTrip) {
        await api.put(`/trips/${editingTrip.id}`, payload)
        setMessage('Trip updated successfully.')
      } else {
        await api.post('/trips', payload)
        setMessage('Trip added successfully.')
      }

      setError('')
      setFormData(initialForm)
      onSaved()
      if (editingTrip && onCancelEdit) {
        onCancelEdit()
      }
    } catch (submitError) {
      console.error('Error saving trip:', submitError)
      const errorMessage = submitError.response?.data?.error || submitError.message || 'Failed to save trip.'
      setError(errorMessage)
      setMessage('')
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
            Trip Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {editingTrip ? 'Edit Trip' : 'Add Trip'}
          </h2>
        </div>

        {editingTrip ? (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel Edit
          </button>
        ) : null}
      </div>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Vehicle</span>
          <input
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Vehicle number"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Driver</span>
          <input
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Driver name"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Source</span>
          <input
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Starting location"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Destination</span>
          <input
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Destination location"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Distance (km)</span>
          <input
            type="number"
            name="distance"
            value={formData.distance}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Enter distance"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 md:col-span-2">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 md:col-span-2">
            {message}
          </p>
        ) : null}

        <button
          type="submit"
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 md:col-span-2"
        >
          {editingTrip ? 'Update Trip' : 'Add Trip'}
        </button>
      </form>
    </section>
  )
}

export default TripForm
