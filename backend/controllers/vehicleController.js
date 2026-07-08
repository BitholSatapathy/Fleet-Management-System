const database = require('../database/vehicleDB')

const getVehicles = (req, res) => {
  database.all('SELECT * FROM vehicles ORDER BY id DESC', [], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch vehicles.' })
    }

    return res.json(rows)
  })
}

const addVehicle = (req, res) => {
  const { vehicleNumber, vehicleType, driverName, status, mileage } = req.body

  database.run(
    `INSERT INTO vehicles (vehicleNumber, vehicleType, driverName, status, mileage)
     VALUES (?, ?, ?, ?, ?)`,
    [vehicleNumber, vehicleType, driverName, status, mileage],
    function insertCallback(error) {
      if (error) {
        return res.status(500).json({ error: 'Failed to add vehicle.' })
      }

      return res.status(201).json({
        id: this.lastID,
        vehicleNumber,
        vehicleType,
        driverName,
        status,
        mileage,
      })
    },
  )
}

const updateVehicle = (req, res) => {
  const { id } = req.params
  const { vehicleNumber, vehicleType, driverName, status, mileage } = req.body

  database.run(
    `UPDATE vehicles
     SET vehicleNumber = ?, vehicleType = ?, driverName = ?, status = ?, mileage = ?
     WHERE id = ?`,
    [vehicleNumber, vehicleType, driverName, status, mileage, id],
    function updateCallback(error) {
      if (error) {
        return res.status(500).json({ error: 'Failed to update vehicle.' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Vehicle not found.' })
      }

      return res.json({
        id,
        vehicleNumber,
        vehicleType,
        driverName,
        status,
        mileage,
      })
    },
  )
}

const deleteVehicle = (req, res) => {
  const { id } = req.params

  database.run('DELETE FROM vehicles WHERE id = ?', [id], function deleteCallback(error) {
    if (error) {
      return res.status(500).json({ error: 'Failed to delete vehicle.' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Vehicle not found.' })
    }

    return res.json({ message: 'Vehicle deleted successfully.' })
  })
}

module.exports = {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
}