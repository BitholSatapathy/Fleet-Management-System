// Simple in-memory GPS simulator for vehicle locations.
// No persistence is intended (in-memory only).

const VEHICLES = [
  { vehicleNumber: 'V-1001', lat: 6.9271, lng: 79.8612 }, // Colombo-ish
  { vehicleNumber: 'V-1002', lat: 6.9344, lng: 79.8287 },
  { vehicleNumber: 'V-1003', lat: 6.9058, lng: 79.8722 },
  { vehicleNumber: 'V-1004', lat: 6.9446, lng: 79.8576 },
]


const metersToLat = (meters) => meters / 111_320
const metersToLng = (meters, lat) => meters / (111_320 * Math.cos((lat * Math.PI) / 180))


const clamp = (val, min, max) => Math.max(min, Math.min(max, val))


// Shared mutable state
let positions = [];
let running = false;
let timer = null;

function init() {
  if (positions.length) return

  positions = VEHICLES.map((v, idx) => {
    const status = idx % 2 === 0 ? 'Moving' : 'Idle'
    return {
      vehicleId: idx + 1,
      vehicleNumber: v.vehicleNumber,
      lat: v.lat,
      lng: v.lng,
      speed: status === 'Moving' ? 12 + Math.random() * 18 : 0,
      status,
      lastUpdated: Date.now(),
    }
  })
}


function step() {
  // Update with small deltas around one city.
  positions = positions.map((p, idx) => {
    const now = Date.now()

    // Change status occasionally
    const bucket = Math.floor(now / 20_000)
    let nextStatus = p.status
    if (bucket % 7 === idx) {
      nextStatus = p.status === 'Moving' ? 'Idle' : 'Moving'
    }

    if (nextStatus === 'Idle') {
      return {
        ...p,
        status: nextStatus,
        speed: 0,
        lastUpdated: now,
      }
    }

    // Moving
    const speed = 10 + Math.random() * 35 // arbitrary km/h-ish
    const meters = 10 + Math.random() * 30

    // Random direction per vehicle, slight bias
    const angle = (idx + 1) * 1.1 + (now / 1000) * 0.07
    const dx = Math.cos(angle) * meters
    const dy = Math.sin(angle) * meters

    const dLat = metersToLat(dy)
    const dLng = metersToLng(dx, p.lat)

    const nextLat = clamp(p.lat + dLat, -90, 90)
    const nextLng = clamp(p.lng + dLng, -180, 180)

    return {
      ...p,
      lat: nextLat,
      lng: nextLng,
      speed,
      status: nextStatus,
      lastUpdated: now,
    }
  })
}


function start({ intervalMs = 5000 } = {}) {
  init()
  if (running) return
  running = true
  timer = setInterval(() => {
    try {
      step()
    } catch {
      // ignore simulator errors
    }
  }, intervalMs)
}


function stop() {
  running = false
  if (timer) clearInterval(timer)
  timer = null
}


function getVehicleLocations() {
  init()
  return positions
}

module.exports = {
  start,
  stop,
  getVehicleLocations,
  VEHICLES,
}


