import {
  FaTruck,
  FaBoxOpen,
  FaTruckFast,
  FaBox,
} from 'react-icons/fa6'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { label: 'Dashboard', icon: FaTruckFast, to: '/dashboard' },
  { label: 'Live Tracking', icon: FaTruck, to: '/live-tracking' },
  { label: 'Analytics', icon: FaTruckFast, to: '/analytics' },
  { label: 'Vehicles', icon: FaTruck, to: '/vehicles' },

  { label: 'Logistics', icon: FaBoxOpen, to: '/logistics' },
]


const Sidebar = () => {
  const location = useLocation()

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-blue-100 bg-white/95 px-5 py-6 shadow-lg shadow-blue-100/70 backdrop-blur xl:flex xl:flex-col">
      <div className="mb-10 flex items-center gap-3 px-1">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-lg font-semibold text-white shadow-md shadow-blue-200">
          <FaBox />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-500">
            Fleet Manager
          </p>
          <h1 className="text-lg font-semibold text-slate-900">Fleet Manager</h1>
        </div>
      </div>

      <nav className="space-y-2">
        {menuItems.map(({ label, icon: Icon, to }) => {
          const isActive = location.pathname === to

          const linkClassName = `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
            isActive
              ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`

          return (
            <Link key={label} to={to} className={linkClassName}>
              <Icon className={`text-base ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto rounded-3xl bg-gradient-to-br from-blue-600 to-sky-500 p-5 text-white shadow-xl shadow-blue-200">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-100">
          Fleet Sync
        </p>
        <p className="mt-2 text-sm leading-6 text-blue-50">
          Track vehicles, drivers, and routes from one clean command center.
        </p>
      </div>
    </aside>
  )
}

export default Sidebar