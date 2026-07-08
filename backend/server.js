const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const fleetRoutes = require('./routes/fleetRoutes')
const { initializeDatabase } = require('./database/database')

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

initializeDatabase()

app.use(cors())
app.use(express.json())

app.use('/api', fleetRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'Fleet Management System API is running',
  })
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
