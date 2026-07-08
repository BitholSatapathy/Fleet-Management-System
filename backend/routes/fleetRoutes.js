const express = require('express')

const { getStatus } = require('../controllers/fleetController')

const router = express.Router()

router.get('/status', getStatus)

module.exports = router
