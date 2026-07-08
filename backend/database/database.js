const sqlite3 = require('sqlite3').verbose()

const database = new sqlite3.Database(':memory:')

const initializeDatabase = () => {
  database.serialize(() => {
    database.run('CREATE TABLE IF NOT EXISTS fleet_status (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)')
  })
}

module.exports = {
  database,
  initializeDatabase,
}
