class Custom_Error extends Error {
  constructor(message, status) {
    super(message)
  }
}

module.exports = Custom_Error
