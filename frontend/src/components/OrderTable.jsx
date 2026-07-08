import { useEffect, useState } from 'react'
import { FaPenToSquare, FaTrashCan } from 'react-icons/fa6'
import api from '../services/api'

const statusClasses = {
  Pending: 'bg-slate-50 text-slate-700 ring-slate-100',
  Assigned: 'bg-blue-50 text-blue-700 ring-blue-100',
  'In Transit': 'bg-amber-50 text-amber-700 ring-amber-100',
  Delivered: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  Cancelled: 'bg-red-50 text-red-700 ring-red-100',
}

const OrderTable = ({ refreshToken, onEdit }) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await api.get('/orders')
      setOrders(response.data)
      setError('')
    } catch (requestError) {
      setError('Failed to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [refreshToken])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/orders/${id}`)
      fetchOrders()
    } catch (deleteError) {
      setError('Failed to delete order.')
    }
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
            Order Management
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">Order Table</h2>
        </div>
      </div>

      {loading ? <p className="text-slate-500">Loading...</p> : null}
      {error ? <p className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</p> : null}

      {!loading && !error ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-sm uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Assigned Driver</th>
                <th className="px-4 py-3">Assigned Vehicle</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
              {orders.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-slate-500" colSpan="5">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-4 font-medium text-slate-900">{order.customerName}</td>
                    <td className="px-4 py-4">{order.deliveryAddress}</td>
                    <td className="px-4 py-4">{order.assignedDriver || '-'}</td>
                    <td className="px-4 py-4">{order.assignedVehicle || '-'}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusClasses[order.status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}
                      >
                        {order.status}
                      </span>
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

export default OrderTable
