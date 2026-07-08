const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

const fleetRoutes = require('./routes/fleetRoutes')
const vehicleRoutes = require('./routes/vehicleRoutes')
const driverRoutes = require('./routes/driverRoutes')
const orderRoutes = require('./routes/orderRoutes')
const tripRoutes = require('./routes/tripRoutes')
const gpsRoutes = require('./routes/gpsRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const { initializeDatabase } = require('./database/database')
const { start: startGpsSimulator } = require('./services/gpsSimulator')


dotenv.config()


const app = express()
const port = process.env.PORT || 5000

initializeDatabase()

app.use(cors())
app.use(express.json())

app.use('/api', fleetRoutes)
app.use('/api', vehicleRoutes)
app.use('/api', driverRoutes)
app.use('/api', orderRoutes)
app.use('/api', tripRoutes)
app.use('/api', gpsRoutes)
app.use('/api', analyticsRoutes)

// Start in-memory GPS simulation.
startGpsSimulator()


app.get('/', (req, res) => {

  res.json({
    message: 'Fleet Management System API is running',
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
