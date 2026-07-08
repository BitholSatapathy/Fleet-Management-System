const { getVehicleLocations } = require('../services/gpsSimulator')

const getGps = (req, res) => {
  try {
    const locations = getVehicleLocations().map((p) => ({
      vehicleNumber: p.vehicleNumber,
      lat: p.lat,
      lng: p.lng,
      status: p.status,
      lastUpdated: p.lastUpdated,
    }))

    res.json({
      count: locations.length,
      updatedAt: Date.now(),
      vehicles: locations,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live vehicle locations.' })
  }
}

module.exports = {
  getGps,
}


