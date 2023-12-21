const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { Unauthenticated } = require('../errors')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
    if (!user) {
      throw new Unauthenticated('Please authenticate.')
    }
    req.token = token
    req.user = user
    next()
  } catch (e) {
    next(new Unauthenticated('Please authenticate.'))
  }
}

module.exports = auth
