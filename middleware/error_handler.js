const { Custom_Error } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const error_handler = (err, req, res, next) => {
  console.log('MERT DEBUG  20231221 (error_handler.js/5) ', { Error: err })
  if (err instanceof Custom_Error) {
    return res.status(err.status).json({ message: err.message })
  }

  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: err.message })
}

module.exports = error_handler
