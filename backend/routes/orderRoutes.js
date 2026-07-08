const express = require('express')

const {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController')

const router = express.Router()

router.get('/orders', getOrders)
router.post('/orders', addOrder)
router.put('/orders/:id', updateOrder)
router.delete('/orders/:id', deleteOrder)

module.exports = router
