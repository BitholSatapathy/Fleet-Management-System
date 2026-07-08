const getStatus = (req, res) => {
  res.json({
    status: 'Server is running',
    project: 'Fleet Management System',
  })
}

module.exports = {
  getStatus,
}
