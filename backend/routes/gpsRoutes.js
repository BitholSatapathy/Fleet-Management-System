const express = require('express')

const { getGps } = require('../controllers/gpsController')


const router = express.Router()

router.get('/gps', getGps)

module.exports = router

