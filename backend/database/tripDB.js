const sqlite3 = require('sqlite3').verbose()

const database = new sqlite3.Database('./fleet.db')

database.serialize(() => {
  database.run(`
    CREATE TABLE IF NOT EXISTS trips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vehicle TEXT,
      driver TEXT,
      source TEXT,
      destination TEXT,
      distance REAL,
      status TEXT
    )
  `)
})

module.exports = database
