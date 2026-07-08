import { useEffect, useState } from 'react'
import api from '../services/api'

const initialForm = {
  customerName: '',
  deliveryAddress: '',
  status: 'Pending',
  assignedVehicle: '',
  assignedDriver: '',
}

const OrderForm = ({ editingOrder, onSaved, onCancelEdit }) => {
  const [formData, setFormData] = useState(initialForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editingOrder) {
      setFormData({
        customerName: editingOrder.customerName || '',
        deliveryAddress: editingOrder.deliveryAddress || '',
        status: editingOrder.status || 'Pending',
        assignedVehicle: editingOrder.assignedVehicle || '',
        assignedDriver: editingOrder.assignedDriver || '',
      })
      setMessage('')
      setError('')
      return
    }

    setFormData(initialForm)
  }, [editingOrder])

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
      if (editingOrder) {
        await api.put(`/orders/${editingOrder.id}`, formData)
        setMessage('Order updated successfully.')
      } else {
        await api.post('/orders', formData)
        setMessage('Order added successfully.')
      }

      setError('')
      setFormData(initialForm)
      onSaved()
      if (editingOrder && onCancelEdit) {
        onCancelEdit()
      }
    } catch (submitError) {
      console.error('Error saving order:', submitError)
      const errorMessage = submitError.response?.data?.error || submitError.message || 'Failed to save order.'
      setError(errorMessage)
      setMessage('')
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
            Order Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            {editingOrder ? 'Edit Order' : 'Add Order'}
          </h2>
        </div>

        {editingOrder ? (
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
          <span className="text-sm font-medium text-slate-700">Customer Name</span>
          <input
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Enter customer name"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Delivery Address</span>
          <input
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Enter delivery address"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Assigned Driver</span>
          <input
            name="assignedDriver"
            value={formData.assignedDriver}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Driver name"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Assigned Vehicle</span>
          <input
            name="assignedVehicle"
            value={formData.assignedVehicle}
            onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            placeholder="Vehicle number"
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
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
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
          {editingOrder ? 'Update Order' : 'Add Order'}
        </button>
      </form>
    </section>
  )
}

export default OrderForm
