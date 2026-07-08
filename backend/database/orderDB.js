const sqlite3 = require('sqlite3').verbose()

const database = new sqlite3.Database('./fleet.db')

database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT,
      deliveryAddress TEXT,
      status TEXT,
      assignedVehicle TEXT,
      assignedDriver TEXT
    )
  `)
})

module.exports = database
