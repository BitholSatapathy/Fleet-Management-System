const database = require('../database/tripDB')

const getTrips = (req, res) => {
  database.all('SELECT * FROM trips ORDER BY id DESC', [], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch trips.' })
    }

    return res.json(rows)
  })
}

const addTrip = (req, res) => {
  const { vehicle, driver, source, destination, distance, status } = req.body

  database.run(
    `INSERT INTO trips (vehicle, driver, source, destination, distance, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [vehicle, driver, source, destination, distance, status],
    function insertCallback(error) {
      if (error) {
        return res.status(500).json({ error: 'Failed to add trip.' })
      }

      return res.status(201).json({
        id: this.lastID,
        vehicle,
        driver,
        source,
        destination,
        distance,
        status,
      })
    },
  )
}

const updateTrip = (req, res) => {
  const { id } = req.params
  const { vehicle, driver, source, destination, distance, status } = req.body

  database.run(
    `UPDATE trips
     SET vehicle = ?, driver = ?, source = ?, destination = ?, distance = ?, status = ?
     WHERE id = ?`,
    [vehicle, driver, source, destination, distance, status, id],
    function updateCallback(error) {
      if (error) {
        return res.status(500).json({ error: 'Failed to update trip.' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Trip not found.' })
      }

      return res.json({
        id,
        vehicle,
        driver,
        source,
        destination,
        distance,
        status,
      })
    },
  )
}

const deleteTrip = (req, res) => {
  const { id } = req.params

  database.run('DELETE FROM trips WHERE id = ?', [id], function deleteCallback(error) {
    if (error) {
      return res.status(500).json({ error: 'Failed to delete trip.' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Trip not found.' })
    }

    return res.json({ message: 'Trip deleted successfully.' })
  })
}

module.exports = {
  getTrips,
  addTrip,
  updateTrip,
  deleteTrip,
}
