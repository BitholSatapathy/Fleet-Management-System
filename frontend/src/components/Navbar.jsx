import { FaCircleUser } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const navigate = useNavigate()
  const { logout, user, role } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-4 shadow-sm shadow-slate-100 backdrop-blur md:px-6 xl:px-8">
      <div>
        <p className="text-sm font-semibold text-slate-500">Fleet Management Dashboard</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Logout
        </button>

        <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
          <div className="flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold text-slate-900">
              {role || 'Admin'}
            </span>
            <span className="text-xs text-slate-500">
              {user === 'driver' ? 'Driver' : 'Operations Lead'}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-200">
            <FaCircleUser className="text-2xl" />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar