const mongoose = require('mongoose')

const connect_db = (url) => {
  return mongoose.connect(url)
}

module.exports = connect_db
