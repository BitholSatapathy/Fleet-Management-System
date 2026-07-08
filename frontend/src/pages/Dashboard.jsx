import { useEffect, useState } from 'react'
import { FaGasPump, FaRoute, FaTruck, FaUsers } from 'react-icons/fa6'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import MapPlaceholder from '../components/MapPlaceholder'
import RecentTrips from '../components/RecentTrips'
import api from '../services/api'

const Dashboard = () => {
  const [vehicleCount, setVehicleCount] = useState('24')

  useEffect(() => {
    const fetchVehicleCount = async () => {
      try {
        const response = await api.get('/vehicles')
        setVehicleCount(response.data.length.toString())
      } catch (requestError) {
        setVehicleCount('0')
      }
    }

    fetchVehicleCount()
  }, [])

  const stats = [
    { title: 'Total Vehicles', value: vehicleCount, icon: FaTruck },
    { title: 'Active Trips', value: '8', icon: FaRoute },
    { title: 'Drivers', value: '18', icon: FaUsers },
    { title: 'Fuel Usage Today', value: '230 L', icon: FaGasPump },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="xl:pl-64">
        <Navbar />

        <main className="space-y-8 p-4 md:p-6 xl:p-8">
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.title} {...stat} />
            ))}
          </section>

          <section className="grid gap-8">
            <MapPlaceholder />
            <RecentTrips />
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
