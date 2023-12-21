const not_found = (req, res, next) => {
  res.status(404).json({ message: 'Route not found' })
}

module.exports = not_found
