const database = require('../database/orderDB')

const getOrders = (req, res) => {
  database.all('SELECT * FROM orders ORDER BY id DESC', [], (error, rows) => {
    if (error) {
      return res.status(500).json({ error: 'Failed to fetch orders.' })
    }

    return res.json(rows)
  })
}

const addOrder = (req, res) => {
  const { customerName, deliveryAddress, status, assignedVehicle, assignedDriver } = req.body

  database.run(
    `INSERT INTO orders (customerName, deliveryAddress, status, assignedVehicle, assignedDriver)
     VALUES (?, ?, ?, ?, ?)`,
    [customerName, deliveryAddress, status, assignedVehicle, assignedDriver],
    function insertCallback(error) {
      if (error) {
        return res.status(500).json({ error: 'Failed to add order.' })
      }

      return res.status(201).json({
        id: this.lastID,
        customerName,
        deliveryAddress,
        status,
        assignedVehicle,
        assignedDriver,
      })
    },
  )
}

const updateOrder = (req, res) => {
  const { id } = req.params
  const { customerName, deliveryAddress, status, assignedVehicle, assignedDriver } = req.body

  database.run(
    `UPDATE orders
     SET customerName = ?, deliveryAddress = ?, status = ?, assignedVehicle = ?, assignedDriver = ?
     WHERE id = ?`,
    [customerName, deliveryAddress, status, assignedVehicle, assignedDriver, id],
    function updateCallback(error) {
      if (error) {
        return res.status(500).json({ error: 'Failed to update order.' })
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Order not found.' })
      }

      return res.json({
        id,
        customerName,
        deliveryAddress,
        status,
        assignedVehicle,
        assignedDriver,
      })
    },
  )
}

const deleteOrder = (req, res) => {
  const { id } = req.params

  database.run('DELETE FROM orders WHERE id = ?', [id], function deleteCallback(error) {
    if (error) {
      return res.status(500).json({ error: 'Failed to delete order.' })
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Order not found.' })
    }

    return res.json({ message: 'Order deleted successfully.' })
  })
}

module.exports = {
  getOrders,
  addOrder,
  updateOrder,
  deleteOrder,
}
