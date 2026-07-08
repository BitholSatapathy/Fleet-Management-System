import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import DriverForm from '../components/DriverForm'
import DriverTable from '../components/DriverTable'
import OrderForm from '../components/OrderForm'
import OrderTable from '../components/OrderTable'
import TripForm from '../components/TripForm'
import TripTable from '../components/TripTable'

const Logistics = () => {
  const [refreshToken, setRefreshToken] = useState(0)
  const [editingDriver, setEditingDriver] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [editingTrip, setEditingTrip] = useState(null)

  const handleSaved = () => {
    setRefreshToken((currentValue) => currentValue + 1)
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="xl:pl-64">
        <Navbar />

        <main className="space-y-8 p-4 md:p-6 xl:p-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
              Logistics Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Logistics</h1>
            <p className="mt-3 text-slate-500">Manage drivers, orders, and trips for your fleet operations.</p>
          </section>

          {/* Section 1: Driver Management */}
          <section>
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
                Section 1
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Driver Management</h2>
            </div>
            <DriverForm
              editingDriver={editingDriver}
              onSaved={handleSaved}
              onCancelEdit={() => setEditingDriver(null)}
            />
            <DriverTable
              refreshToken={refreshToken}
              onEdit={setEditingDriver}
            />
          </section>

          {/* Section 2: Delivery Orders */}
          <section>
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
                Section 2
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Delivery Orders</h2>
            </div>
            <OrderForm
              editingOrder={editingOrder}
              onSaved={handleSaved}
              onCancelEdit={() => setEditingOrder(null)}
            />
            <OrderTable
              refreshToken={refreshToken}
              onEdit={setEditingOrder}
            />
          </section>

          {/* Section 3: Trips */}
          <section>
            <div className="mb-4">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
                Section 3
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Trips</h2>
            </div>
            <TripForm
              editingTrip={editingTrip}
              onSaved={handleSaved}
              onCancelEdit={() => setEditingTrip(null)}
            />
            <TripTable
              refreshToken={refreshToken}
              onEdit={setEditingTrip}
            />
          </section>
        </main>
      </div>
    </div>
  )
}

export default Logistics
