const express = require('express')

const {
  getTrips,
  addTrip,
  updateTrip,
  deleteTrip,
} = require('../controllers/tripController')

const router = express.Router()

router.get('/trips', getTrips)
router.post('/trips', addTrip)
router.put('/trips/:id', updateTrip)
router.delete('/trips/:id', deleteTrip)

module.exports = router
