import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DriverPortal = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-6 md:px-6 xl:px-8">
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">
              Driver Portal
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Driver Portal</h1>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {[
            ['Assigned Vehicle', 'Truck 07 - MH 12 AB 1234'],
            ['Today\'s Route', 'Mumbai Depot → Pune Warehouse'],
            ['Delivery Schedule', '3 deliveries scheduled for today'],
            ['Safety Score', '96 / 100'],
          ].map(([label, value]) => (
            <article key={label} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-500">
                {label}
              </p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{value}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default DriverPortal
