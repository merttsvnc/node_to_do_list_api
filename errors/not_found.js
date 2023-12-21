const { StatusCodes } = require('http-status-codes')
const Custom_Error = require('./custom_error')

class Not_Found extends Custom_Error {
  constructor(message) {
    super(message)
    this.status = StatusCodes.NOT_FOUND
  }
}

module.exports = Not_Found
