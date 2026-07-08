import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import DriverPortal from './pages/DriverPortal'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
	return (
		<Routes>
			<Route path="/" element={<Login />} />
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/driver"
				element={
					<ProtectedRoute>
						<DriverPortal />
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<Navigate to="/" replace />} />
		</Routes>
	)
}

export default App
