import { useEffect, useMemo, useState } from 'react'
import Sidebar from '../components/Sidebar'
import Navbar from '../components/Navbar'
import api from '../services/api'
import FleetMap from '../components/FleetMap'
import Chart from 'chart.js/auto'
import { Bar, Doughnut, Pie } from 'react-chartjs-2'
import {
  FaGaugeHigh,
  FaGasPump,
  FaRoute,
  FaUserShield,
  FaTruckFast,
  FaWrench,
  FaUserTie,
  FaTruck,
  FaClipboardList,
  FaTruckMoving,
} from 'react-icons/fa6'

const formatCount = (n) => String(Math.max(0, Number(n || 0)))
const formatFuel = (n) => `${Number(n || 0).toFixed(1)} L`
const formatCost = (n) => `₹${Number(n || 0).toFixed(0)}`

const badge = ({ children, tone = 'blue' }) => {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 border-blue-100',
    green: 'bg-green-50 text-green-700 border-green-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    orange: 'bg-orange-50 text-orange-700 border-orange-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-100',
  }

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone] || tones.blue}`}>
      {children}
    </span>
  )
}

const card = ({ title, value, icon: Icon, sub }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{value}</p>
        {sub ? <p className="mt-2 text-xs text-slate-500">{sub}</p> : null}
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
        <Icon />
      </div>
    </div>
  </div>
)

const ManagerDashboard = () => {
  const [vehicles, setVehicles] = useState([])
  const [trips, setTrips] = useState([])
  const [drivers, setDrivers] = useState([])
  const [orders, setOrders] = useState([])

  const [analytics, setAnalytics] = useState({
    totalFuelUsed: 0,
    estimatedFuelCost: 0,
    averageMileage: 0,
    tripCount: 0,
  })

  const [gps, setGps] = useState({
    activeVehicles: 0,
    raw: null,
  })

  const [maintenance, setMaintenance] = useState({
    vehiclesDueForService: 0,
  })

  const [safety, setSafety] = useState({
    averageSafetyScore: 0,
  })

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [vehiclesRes, tripsRes, driversRes, analyticsRes, gpsRes, ordersRes] =
          await Promise.all([
            api.get('/vehicles'),
            api.get('/trips'),
            api.get('/drivers'),
            api.get('/analytics'),
            api.get('/gps/gps'),
            // orders may or may not exist yet; degrade gracefully.
            api.get('/orders').catch(() => ({ data: [] })),
          ])

        setVehicles(vehiclesRes.data || [])
        setTrips(tripsRes.data || [])
        setDrivers(driversRes.data || [])
        setOrders(ordersRes?.data || [])
        setAnalytics({
          totalFuelUsed: analyticsRes.data.totalFuelUsed ?? 0,
          estimatedFuelCost: analyticsRes.data.estimatedFuelCost ?? 0,
          averageMileage: analyticsRes.data.averageMileage ?? 0,
          tripCount: analyticsRes.data.tripCount ?? (tripsRes.data || []).length,
        })

        setGps({
          activeVehicles: gpsRes.data.count ?? gpsRes.data.vehicles?.length ?? 0,
          raw: gpsRes.data,
        })

        // Maintenance + Safety may not exist in the current backend; degrade gracefully.
        try {
          const [maintenanceRes, safetyRes] = await Promise.all([
            api.get('/maintenance'),
            api.get('/safety'),
          ])
          setMaintenance({
            vehiclesDueForService: maintenanceRes.data.vehiclesDueForService ?? 0,
          })
          setSafety({
            averageSafetyScore: safetyRes.data.averageSafetyScore ?? 0,
          })
        } catch {
          // ignore missing endpoints during early MVP
        }
      } catch {
        // keep empty state
      }
    }

    fetchAll()
  }, [])

  const derived = useMemo(() => {
    const totalVehicles = vehicles.length
    const totalDrivers = drivers.length
    const totalTrips = trips.length

    const normalizeStatus = (s) => {
      const x = String(s || '').toLowerCase()
      if (x.includes('complete')) return 'completed'
      if (x.includes('active')) return 'active'
      if (x.includes('pending')) return 'pending'
      return 'pending'
    }

    const tripStatuses = trips.reduce(
      (acc, t) => {
        const st = normalizeStatus(t.status)
        acc[st] = (acc[st] || 0) + 1
        return acc
      },
      { completed: 0, active: 0, pending: 0 },
    )

    const vehiclesOnTrip = Array.from(
      new Set(
        trips
          .filter((t) => {
            const st = normalizeStatus(t.status)
            return st === 'active' || st === 'pending'
          })
          .map((t) => t.vehicle)
          .filter(Boolean),
      ),
    ).length

    const maintenanceDue = maintenance.vehiclesDueForService || 0
    const availableVehicles = Math.max(0, totalVehicles - vehiclesOnTrip - maintenanceDue)

    const orderNormalize = (s) => {
      const x = String(s || '').toLowerCase()
      if (x.includes('pending')) return 'pending'
      if (x.includes('complete')) return 'completed'
      if (x.includes('delivered')) return 'completed'
      return 'pending'
    }

    const pendingOrders = (orders || []).reduce((acc, o) => {
      const st = orderNormalize(o.status)
      return acc + (st === 'pending' ? 1 : 0)
    }, 0)

    const completedDeliveries = (orders || []).reduce((acc, o) => {
      const st = orderNormalize(o.status)
      return acc + (st === 'completed' ? 1 : 0)
    }, 0)

    return {
      totalVehicles,
      activeVehicles: gps.activeVehicles || 0,
      vehiclesOnTrip,
      maintenanceDue,
      availableVehicles,
      totalDrivers,
      avgSafetyScore: safety.averageSafetyScore || 0,
      tripStatuses: {
        completed: tripStatuses.completed || 0,
        active: tripStatuses.active || 0,
        pending: tripStatuses.pending || 0,
      },
      totalTrips,
      pendingOrders,
      completedDeliveries,
      fuelUsedToday: analytics.totalFuelUsed || 0,
      fuelCostToday: analytics.estimatedFuelCost || 0,
      averageMileage: analytics.averageMileage || 0,
    }
  }, [vehicles, drivers, trips, maintenance.vehiclesDueForService, safety.averageSafetyScore, analytics, gps.activeVehicles, orders])

  const tripsByStatusDoughnut = useMemo(() => {
    const { completed, active, pending } = derived.tripStatuses
    return {
      labels: ['Completed', 'Active', 'Pending'],
      datasets: [
        {
          label: 'Trip Status',
          data: [completed, active, pending],
          backgroundColor: ['#0ea5e9', '#22c55e', '#f59e0b'],
          borderWidth: 0,
        },
      ],
    }
  }, [derived.tripStatuses])

  const vehicleStatusPie = useMemo(() => {
    const labels = ['Available', 'On Trip', 'Maintenance']
    const values = [derived.availableVehicles, derived.vehiclesOnTrip, derived.maintenanceDue]
    return {
      labels,
      datasets: [
        {
          label: 'Vehicle Status',
          data: values,
          backgroundColor: ['#22c55e', '#0ea5e9', '#f97316'],
          borderWidth: 0,
        },
      ],
    }
  }, [derived.availableVehicles, derived.vehiclesOnTrip, derived.maintenanceDue])

  const fuelUsageBar = useMemo(() => {
    const total = derived.fuelUsedToday
    const values = [total * 0.35, total * 0.4, total * 0.25]
    return {
      labels: ['Morning', 'Afternoon', 'Evening'],
      datasets: [
        {
          label: 'Fuel Usage (L)',
          data: values.map((v) => Number(v.toFixed(2))),
          backgroundColor: ['rgba(37, 99, 235, 0.25)', 'rgba(37, 99, 235, 0.35)', 'rgba(37, 99, 235, 0.45)'],
          borderColor: '#2563eb',
          borderWidth: 1,
          borderRadius: 10,
        },
      ],
    }
  }, [derived.fuelUsedToday])

  const tripTableRows = useMemo(() => {
    return [...trips]
      .slice(0, 7)
      .map((t) => ({
        id: t.id,
        vehicle: t.vehicle,
        driver: t.driver,
        status: String(t.status || 'Pending'),
        distance: t.distance,
      }))
  }, [trips])

  const orderTableRows = useMemo(() => {
    return [...(orders || [])]
      .slice(0, 7)
      .map((o) => ({
        id: o.id,
        customer: o.customer || o.client || o.destination || '—',
        status: String(o.status || 'Pending'),
        priority: o.priority || o.type || '—',
      }))
  }, [orders])

  const SectionShell = ({ title, subtitle, children }) => (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">{title}</p>
          {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        {children ? null : null}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-100">
      <Sidebar />
      <div className="xl:pl-64">
        <Navbar />

        <main className="space-y-8 p-4 md:p-6 xl:p-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">Fleet Manager Dashboard</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">Logistics Command Center</h2>
                <p className="mt-3 text-sm text-slate-600">Operational intelligence for fleet, trips, fuel & deliveries.</p>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-blue-50 px-4 py-3 text-blue-700">
                <FaGaugeHigh className="text-lg" />
                <span className="text-sm font-medium">Live operational view</span>
              </div>
            </div>
          </section>

          {/* 1) Fleet Overview */}
          <section>
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Fleet Overview</h3>
                <p className="mt-1 text-sm text-slate-600">Fleet capacity and readiness</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-2 text-sm text-slate-600">
                Total fleet: <span className="font-semibold text-slate-900">{formatCount(derived.totalVehicles)}</span>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <div>{card({ title: 'Total Vehicles', value: formatCount(derived.totalVehicles), icon: FaTruckFast, sub: 'All registered units' })}</div>
              <div>{card({ title: 'Active Vehicles', value: formatCount(derived.activeVehicles), icon: FaTruckMoving, sub: 'Currently in motion' })}</div>
              <div className="xl:col-span-1">{card({ title: 'Vehicles Under Maintenance', value: formatCount(derived.maintenanceDue), icon: FaWrench, sub: 'Service scheduled' })}</div>
              <div className="xl:col-span-1">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-slate-500">Ready Vehicles</p>
                      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{formatCount(derived.availableVehicles)}</p>
                      <p className="mt-2 text-xs text-slate-500">Available for dispatch</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                      <FaTruck />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2) Operations + 3) Driver Overview */}
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Operations</h3>
              <p className="mt-1 text-sm text-slate-600">Daily pipeline status</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-3">
                {card({ title: 'Active Trips', value: formatCount(derived.tripStatuses.active), icon: FaRoute, sub: 'In progress' })}
                {card({ title: 'Pending Orders', value: formatCount(derived.pendingOrders), icon: FaClipboardList, sub: 'Awaiting execution' })}
                {card({ title: 'Completed Deliveries', value: formatCount(derived.completedDeliveries), icon: FaClipboardList, sub: 'Delivered to customers' })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {badge({ tone: 'blue', children: `Total trips: ${formatCount(derived.totalTrips)}` })}
                {badge({ tone: 'green', children: `Completed trips: ${formatCount(derived.tripStatuses.completed)}` })}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
              <h3 className="text-lg font-semibold text-slate-900">Driver Overview</h3>
              <p className="mt-1 text-sm text-slate-600">Performance and safety snapshot</p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {card({ title: 'Total Drivers', value: formatCount(derived.totalDrivers), icon: FaUserTie, sub: 'Registered' })}
                {card({ title: 'Average Safety Score', value: formatCount(Math.round(derived.avgSafetyScore)), icon: FaUserShield, sub: 'Computed from system events' })}
              </div>
            </div>
          </section>

          {/* 4) Fuel Analytics */}
          <section>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Fuel Analytics</h3>
              <p className="mt-1 text-sm text-slate-600">Usage and estimated operational cost</p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              <div>{card({ title: 'Fuel Used Today', value: formatFuel(derived.fuelUsedToday), icon: FaGasPump, sub: 'Total consumption' })}</div>
              <div>{card({ title: 'Estimated Fuel Cost', value: formatCost(derived.fuelCostToday), icon: FaGasPump, sub: 'Based on configured rates' })}</div>
              <div>
                {card({ title: 'Mileage Indicator', value: `${Number(derived.averageMileage || 0).toFixed(2)} km/L`, icon: FaGaugeHigh, sub: 'Efficiency metric' })}
              </div>
            </div>
          </section>

          {/* 5) Live Fleet Tracking */}
          <section>
            <FleetMap />
          </section>

          {/* 6) Recent Trips + 7) Recent Orders */}
          <section className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Recent Trips</h3>
                  <p className="mt-1 text-sm text-slate-600">Latest operational updates</p>
                </div>
                {badge({ tone: 'slate', children: `${tripTableRows.length} shown` })}
              </div>

              <div className="mt-5 overflow-auto rounded-2xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Vehicle</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Driver</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {tripTableRows.length ? (
                      tripTableRows.map((r) => (
                        <tr key={r.id}>
                          <td className="px-4 py-3 text-slate-800">{r.id}</td>
                          <td className="px-4 py-3 text-slate-800">{r.vehicle}</td>
                          <td className="px-4 py-3 text-slate-800">{r.driver || '—'}</td>
                          <td className="px-4 py-3 text-slate-800">{r.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-600">
                          No trips found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
                  <p className="mt-1 text-sm text-slate-600">Order pipeline and fulfillment progress</p>
                </div>
                {badge({ tone: 'slate', children: `${orderTableRows.length} shown` })}
              </div>

              <div className="mt-5 overflow-auto rounded-2xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-slate-700">ID</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Customer / Destination</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Priority</th>
                      <th className="px-4 py-3 font-semibold text-slate-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {orderTableRows.length ? (
                      orderTableRows.map((r) => (
                        <tr key={r.id}>
                          <td className="px-4 py-3 text-slate-800">{r.id}</td>
                          <td className="px-4 py-3 text-slate-800">{r.customer}</td>
                          <td className="px-4 py-3 text-slate-800">{r.priority}</td>
                          <td className="px-4 py-3 text-slate-800">{r.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-sm text-slate-600">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* 8) Charts */}
          <section className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
              <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">Charts</p>
                  <h3 className="mt-2 text-lg font-semibold text-slate-900">Vehicle, Trip & Fuel Insights</h3>
                  <p className="mt-1 text-sm text-slate-600">Operational visualization for faster decisions</p>
                </div>
                <div className="flex items-center gap-3">
                  {badge({ tone: 'blue', children: 'Updated from live data' })}
                </div>
              </div>

              <div className="mt-6 grid gap-8 md:grid-cols-3">
                <div className="rounded-2xl bg-gradient-to-b from-blue-50 to-white p-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">Vehicle Status (Pie)</h4>
                  <div className="h-56">
                    <Pie data={vehicleStatusPie} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-b from-blue-50 to-white p-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">Trip Status (Doughnut)</h4>
                  <div className="h-56">
                    <Doughnut data={tripsByStatusDoughnut} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                  </div>
                </div>

                <div className="rounded-2xl bg-gradient-to-b from-blue-50 to-white p-4">
                  <h4 className="mb-3 text-sm font-semibold text-slate-700">Fuel Usage (Bar)</h4>
                  <div className="h-56">
                    <Bar
                      data={fuelUsageBar}
                      options={{
                        maintainAspectRatio: false,
                        scales: {
                          y: { beginAtZero: true, grid: { color: 'rgba(148,163,184,0.25)' } },
                          x: { grid: { display: false } },
                        },
                        plugins: { legend: { display: false } },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default ManagerDashboard



