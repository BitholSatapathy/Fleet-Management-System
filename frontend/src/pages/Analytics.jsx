import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import AnalyticsCards from '../components/AnalyticsCards'
import FuelChart from '../components/FuelChart'
import api from '../services/api'

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [fuelUsedPerTrip, setFuelUsedPerTrip] = useState([])

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get('/analytics')
        setAnalytics(response.data)
        setFuelUsedPerTrip(response.data.tripFuelUsed || [])

      } catch (err) {
        setAnalytics({
          totalFuelUsed: 0,
          totalDistance: 0,
          averageMileage: 0,
          estimatedFuelCost: 0,
          tripCount: 0,
        })
        setFuelUsedPerTrip([])
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="xl:pl-64">
        <Navbar />

        <main className="space-y-8 p-4 md:p-6 xl:p-8">
          <AnalyticsCards analytics={analytics} />

          <div className="grid gap-8">
            <FuelChart fuelUsedPerTrip={fuelUsedPerTrip} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default Analytics

