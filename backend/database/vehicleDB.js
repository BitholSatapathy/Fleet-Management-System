const sqlite3 = require('sqlite3').verbose()

const database = new sqlite3.Database('./fleet.db')

database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS vehicles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicleNumber TEXT,
      vehicleType TEXT,
      driverName TEXT,
      status TEXT,
      mileage INTEGER
    )
  `)
})

module.exports = database