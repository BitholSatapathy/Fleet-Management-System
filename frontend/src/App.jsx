import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import DriverPortal from './pages/DriverPortal'
import ProtectedRoute from './components/ProtectedRoute'
import Vehicles from './pages/Vehicles'
import Logistics from './pages/Logistics'
import LiveTracking from './pages/LiveTracking'
import Analytics from './pages/Analytics'


const App = () => {	
	return (
		<Routes>
			<Route path="/" element={<Login />} />

			<Route
				path="/vehicles"
				element={
					<ProtectedRoute allowedRoles={[ 'Admin' ]}>
						<Vehicles />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/logistics"
				element={
					<ProtectedRoute allowedRoles={[ 'Admin' ]}>
						<Logistics />
					</ProtectedRoute>
				}
			/>
			<Route
				path="/dashboard"
				element={
					<ProtectedRoute>
						<Dashboard />
					</ProtectedRoute>
				}
			/>
				<Route
					path="/live-tracking"
					element={
						<ProtectedRoute>
							<LiveTracking />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/analytics"
					element={
						<ProtectedRoute>
							<Analytics />
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
