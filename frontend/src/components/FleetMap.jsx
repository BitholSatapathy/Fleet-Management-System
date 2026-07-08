import { useEffect, useMemo, useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import api from '../services/api'
import VehicleMarker from './VehicleMarker'
import 'leaflet/dist/leaflet.css'

const FitBounds = ({ markers }) => {
  const map = useMap()

  useEffect(() => {
    if (!markers || markers.length === 0) return

    const bounds = markers.reduce((acc, v, idx) => {
      const point = [v.lat, v.lng]
      if (idx === 0) return acc.extend(point)
      acc.extend(point)
      return acc
    }, new window.L.LatLngBounds([markers[0].lat, markers[0].lng]))

    map.fitBounds(bounds, { padding: [30, 30], maxZoom: 15 })
  }, [markers, map])

  return null
}

const FleetMap = () => {
  const [vehicles, setVehicles] = useState([])
  const [error, setError] = useState(null)

  const pollingMs = 5000

  useEffect(() => {
    let cancelled = false

    const fetchLive = async () => {
      try {
        const res = await api.get('/gps')
        if (cancelled) return
        // API returns either {vehicles:[...]} or direct array; normalize.
        const payload = res.data
        const list = Array.isArray(payload) ? payload : payload?.vehicles
        setVehicles(list ?? [])
        setError(null)
      } catch (e) {
        if (cancelled) return
        setError('Failed to load live tracking.')
      }
    }

    fetchLive()
    const id = setInterval(fetchLive, pollingMs)

    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [])

  const center = useMemo(() => {
    const first = vehicles[0]
    return first ? [first.lat, first.lng] : [6.9271, 79.8612]
  }, [vehicles])

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-100">
      <div className="mb-5">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-500">Live Fleet Tracking</p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Live Fleet Map</h2>
      </div>

      <div className="relative">
        {error ? (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
        ) : null}

        <MapContainer
          className="h-[420px] w-full rounded-3xl border border-dashed border-blue-200"
          center={center}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitBounds markers={vehicles} />

          {vehicles.map((v) => (
            <VehicleMarker key={v.vehicleNumber} vehicle={v} />
          ))}
        </MapContainer>
      </div>
    </section>
  )
}

export default FleetMap

