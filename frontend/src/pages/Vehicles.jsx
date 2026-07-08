import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import VehicleForm from '../components/VehicleForm'
import VehicleTable from '../components/VehicleTable'

const Vehicles = () => {
  const [refreshToken, setRefreshToken] = useState(0)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [vehicleCount, setVehicleCount] = useState(0)

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
              Vehicle Management
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Vehicles</h1>
            <p className="mt-3 text-slate-500">Manage your fleet inventory and current vehicle status.</p>
            <p className="mt-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Total Vehicles: {vehicleCount}
            </p>
          </section>

          <VehicleForm
            editingVehicle={editingVehicle}
            onSaved={handleSaved}
            onCancelEdit={() => setEditingVehicle(null)}
          />

          <VehicleTable
            refreshToken={refreshToken}
            onEdit={setEditingVehicle}
            onCountChange={setVehicleCount}
          />
        </main>
      </div>
    </div>
  )
}

export default Vehicles