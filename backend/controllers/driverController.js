const database = require('../database/driverDB')

const getDrivers = (req, res) => {
  database.all('SELECT * FROM drivers ORDER BY id DESC', [], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch drivers.' })
    }

    return res.json(rows)
  })
}

const addDriver = (req, res) => {
  const { name, phone, licenseNumber, status, safetyScore } = req.body

  console.log('Adding driver:', { name, phone, licenseNumber, status, safetyScore })

  database.run(
    `INSERT INTO drivers (name, phone, licenseNumber, status, safetyScore)
     VALUES (?, ?, ?, ?, ?)`,
    [name, phone, licenseNumber, status, safetyScore],
    function insertCallback(error) {
      if (error) {
        console.error('Error adding driver:', error)
        return res.status(500).json({ error: 'Failed to add driver.' })
      }

      return res.status(201).json({
        id: this.lastID,
        name,
        phone,
        licenseNumber,
        status,
        safetyScore,
      })
    },
  )
}

const updateDriver = (req, res) => {
  const { id } = req.params
  const { name, phone, licenseNumber, status, safetyScore } = req.body

  database.run(
    `UPDATE drivers
     SET name = ?, phone = ?, licenseNumber = ?, status = ?, safetyScore = ?
     WHERE id = ?`,
    [name, phone, licenseNumber, status, safetyScore, id],
    function updateCallback(error) {
      if (error) {
        return res.status(500).json({ error: 'Failed to update driver.' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Driver not found.' })
      }

      return res.json({
        id,
        name,
        phone,
        licenseNumber,
        status,
        safetyScore,
      })
    },
  )
}

const deleteDriver = (req, res) => {
  const { id } = req.params

  database.run('DELETE FROM drivers WHERE id = ?', [id], function deleteCallback(error) {
    if (error) {
      return res.status(500).json({ error: 'Failed to delete driver.' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Driver not found.' })
    }

    return res.json({ message: 'Driver deleted successfully.' })
  })
}

module.exports = {
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
}
