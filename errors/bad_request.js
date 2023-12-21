const { StatusCodes } = require('http-status-codes')
const Custom_Error = require('./custom_error')

class Bad_Request extends Custom_Error {
  constructor(message) {
    super(message)
    this.status = StatusCodes.BAD_REQUEST
  }
}

module.exports = Bad_Request
