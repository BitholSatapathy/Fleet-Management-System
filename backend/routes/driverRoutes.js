const express = require('express')

const {
  getDrivers,
  addDriver,
  updateDriver,
  deleteDriver,
} = require('../controllers/driverController')

const router = express.Router()

router.get('/drivers', getDrivers)
router.post('/drivers', addDriver)
router.put('/drivers/:id', updateDriver)
router.delete('/drivers/:id', deleteDriver)

module.exports = router
