const sqlite3 = require('sqlite3').verbose()

const database = new sqlite3.Database('./fleet.db')

database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS drivers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      phone TEXT,
      licenseNumber TEXT,
      status TEXT,
      safetyScore INTEGER
    )
  `)
})

module.exports = database
