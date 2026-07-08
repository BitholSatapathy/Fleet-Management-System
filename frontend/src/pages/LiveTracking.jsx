import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import FleetMap from '../components/FleetMap'

const LiveTracking = () => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />

      <div className="xl:pl-64">
        <Navbar />

        <main className="space-y-8 p-4 md:p-6 xl:p-8">
          <FleetMap />
        </main>
      </div>
    </div>
  )
}

export default LiveTracking

