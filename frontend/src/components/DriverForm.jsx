import { useEffect, useState } from 'react'
import api from '../services/api'

const initialForm = {
  name: '',
  phone: '',
  licenseNumber: '',
  status: 'Available',
  safetyScore: '',
}

const DriverForm = ({ editingDriver, onSaved, onCancelEdit }) => {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingDriver) {
      setFormData({
        name: editingDriver.name || '',
        phone: editingDriver.phone || '',
        licenseNumber: editingDriver.licenseNumber || '',
        status: editingDriver.status || 'Available',
        safetyScore: editingDriver.safetyScore?.toString() || '',
      })
      setMessage('')
      setError('')
      return
    }

    setFormData(initialForm)
  }, [editingDriver])

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
        safetyScore: Number(formData.safetyScore),
      }

      if (editingDriver) {
        await api.put(`/drivers/${editingDriver.id}`, payload)
        setMessage('Driver updated successfully.')
      } else {
        await api.post('/drivers', payload)
        setMessage('Driver added successfully.')
      }

      setError('')
      setFormData(initialForm)
      onSaved()
      if (editingDriver && onCancelEdit) {
        onCancelEdit()
      }
    } catch (submitError) {
      console.error('Error saving driver:', submitError)
      const errorMessage = submitError.response?.data?.error || submitError.message || 'Failed to save driver.'
      setError(errorMessage)
      setMessage('')
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
            Driver Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {editingDriver ? 'Edit Driver' : 'Add Driver'}
          </h2>
        </div>

        {editingDriver ? (
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
          <span className="text-sm font-medium text-slate-700">Name</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Enter driver name"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Phone</span>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="+91 98765 43210"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">License Number</span>
          <input
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="DL-123456789"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Safety Score</span>
          <input
            type="number"
            name="safetyScore"
            value={formData.safetyScore}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="1-100"
          />
        </label>

        <label className="block space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">Status</span>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          >
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="On Leave">On Leave</option>
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
          {editingDriver ? 'Update Driver' : 'Add Driver'}
        </button>
      </form>
    </section>
  )
}

export default DriverForm
