import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Fix default icon paths for Leaflet bundlers (optional but prevents missing icon issues)
const defaultIcon = new L.Icon({
  iconUrl:
    new URL('leaflet/dist/images/marker-icon.png', import.meta.url).toString(),
  iconRetinaUrl:
    new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).toString(),
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).toString(),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const VehicleMarker = ({ vehicle, onClick }) => {
  if (!vehicle) return null

  const { vehicleNumber, lat, lng, status, lastUpdated } = vehicle

  return (
    <Marker
      position={[lat, lng]}
      icon={defaultIcon}
      eventHandlers={
        onClick
          ? {
              click: () => onClick(vehicle),
            }
          : undefined
      }
    >
      <Popup>
        <div className="min-w-[180px]">
          <div className="font-semibold text-slate-900">{vehicleNumber}</div>
          <div className="mt-1 text-sm text-slate-600">Status: {status}</div>
          {lastUpdated ? (
            <div className="mt-1 text-xs text-slate-500">
              Updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>
          ) : null}
        </div>
      </Popup>
    </Marker>
  )
}

export default VehicleMarker

