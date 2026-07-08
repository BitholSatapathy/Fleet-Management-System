import { useEffect, useState } from 'react'
import api from '../services/api'

const initialForm = {
  vehicleNumber: '',
  vehicleType: '',
  driverName: '',
  mileage: '',
  status: 'Available',
}

const VehicleForm = ({ editingVehicle, onSaved, onCancelEdit }) => {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        vehicleNumber: editingVehicle.vehicleNumber || '',
        vehicleType: editingVehicle.vehicleType || '',
        driverName: editingVehicle.driverName || '',
        mileage: editingVehicle.mileage?.toString() || '',
        status: editingVehicle.status || 'Available',
      })
      setMessage('')
      setError('')
      return
    }

    setFormData(initialForm)
  }, [editingVehicle])

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
        mileage: Number(formData.mileage),
      }

      if (editingVehicle) {
        await api.put(`/vehicles/${editingVehicle.id}`, payload)
        setMessage('Vehicle updated successfully.')
      } else {
        await api.post('/vehicles', payload)
        setMessage('Vehicle added successfully.')
      }

      setError('')
      setFormData(initialForm)
      onSaved()
      if (editingVehicle && onCancelEdit) {
        onCancelEdit()
      }
    } catch (submitError) {
      setError('Failed to save vehicle.')
      setMessage('')
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
            Fleet Operations
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}
          </h2>
        </div>

        {editingVehicle ? (
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
          <span className="text-sm font-medium text-slate-700">Vehicle Number</span>
          <input
            name="vehicleNumber"
            value={formData.vehicleNumber}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="MH 12 AB 1234"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Vehicle Type</span>
          <input
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Truck / Van"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Driver Name</span>
          <input
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Enter driver name"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Mileage</span>
          <input
            type="number"
            name="mileage"
            value={formData.mileage}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="120000"
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
            <option value="On Delivery">On Delivery</option>
            <option value="Maintenance">Maintenance</option>
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
          {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </button>
      </form>
    </section>
  )
}

export default VehicleForm