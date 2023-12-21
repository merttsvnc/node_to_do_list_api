const { StatusCodes } = require('http-status-codes')
const Custom_Error = require('./custom_error')

class Unauthenticated extends Custom_Error {
  constructor(message) {
    super(message)
    this.status = StatusCodes.UNAUTHORIZED
  }
}

module.exports = Unauthenticated
