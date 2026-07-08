const tripDb = require('../database/tripDB')
const vehicleDb = require('../database/vehicleDB')

const {
  DEFAULT_COST_PER_LITER,
  computeFuelUsed,
  computeEstimatedFuelCost,
} = require('../services/fuelService')

// MVP assumption: "today" = all trips currently present in the DB
const getAnalytics = async (req, res) => {
  const costPerLiter = DEFAULT_COST_PER_LITER

  try {
    // Fetch trips. Join with vehicles using a separate query (MVP) because
    // the current project uses separate sqlite3 DB connections per table module.
    // We'll compute mileage by matching vehicleNumber -> vehicles.vehicleNumber.
    const trips = await new Promise((resolve, reject) => {
      tripDb.all('SELECT * FROM trips ORDER BY id DESC', [], (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      })
    })

    const vehicles = await new Promise((resolve, reject) => {
      vehicleDb.all('SELECT * FROM vehicles', [], (err, rows) => {
        if (err) return reject(err)
        resolve(rows)
      })
    })

    const vehicleMileageByNumber = new Map(
      vehicles.map((v) => [v.vehicleNumber, v.mileage]),
    )

    const tripComputations = trips.map((t) => {
      const mileage = vehicleMileageByNumber.get(t.vehicle)
      const fuelUsed = computeFuelUsed({ distance: t.distance, mileage })
      const estimatedFuelCost = computeEstimatedFuelCost(fuelUsed, costPerLiter)

      return {
        tripId: t.id,
        vehicle: t.vehicle,
        distance: t.distance,
        mileage,
        fuelUsed,
        estimatedFuelCost,
      }
    })

    const totalFuelUsed = tripComputations.reduce((sum, t) => sum + t.fuelUsed, 0)
    const totalDistance = tripComputations.reduce((sum, t) => sum + Number(t.distance || 0), 0)

    // Average Mileage: totalDistance / totalFuelUsed (km per liter)
    const averageMileage = totalFuelUsed > 0 ? totalDistance / totalFuelUsed : 0

    const estimatedFuelCost = computeEstimatedFuelCost(totalFuelUsed, costPerLiter)

    return res.json({
      totalFuelUsed,
      totalDistance,
      averageMileage,
      estimatedFuelCost,
      tripCount: tripComputations.length,
      tripFuelUsed: tripComputations.map((t) => ({ tripId: t.tripId, fuelUsed: t.fuelUsed })),
    })

  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch analytics.' })
  }
}

module.exports = {
  getAnalytics,
}

