const User = require('../models/user')
const async_wrapper = require('../middleware/async_wrapper')
const { StatusCodes } = require('http-status-codes')
const { Bad_Request } = require('../errors')

const register_user = async_wrapper(async (req, res) => {
  const user = new User(req.body)
  await user.save()
  const token = await user.generate_auth_token()
  res.status(StatusCodes.CREATED).json({ user, token })
})

const login_user = async_wrapper(async (req, res) => {
  const { email, password } = req.body
  const user = await User.find_by_credentials(email, password)
  const token = await user.generate_auth_token()
  res.status(StatusCodes.OK).json({ user, token })
})

const logout_user = async_wrapper(async (req, res) => {
  const { user, token } = req
  user.tokens = user.tokens.filter((t) => t.token !== token)
  await user.save()
  res.status(StatusCodes.OK).json({ message: 'Logout user' })
})

const logout_all_user = async_wrapper(async (req, res) => {
  const { user } = req
  user.tokens = []
  await user.save()
  res.status(StatusCodes.OK).json({ message: 'Logout all user' })
})

const get_user = async (req, res) => {
  res.send(req.user)
}

const update_user = async_wrapper(async (req, res, next) => {
  const updates = Object.keys(req.body)
  const allowed_updates = ['name', 'email', 'password']
  const is_valid_operation = updates.every((update) =>
    allowed_updates.includes(update)
  )
  if (!is_valid_operation) {
    return next(new Bad_Request('Invalid updates!'))
  }
  const { user } = req
  updates.forEach((update) => (user[update] = req.body[update]))
  await user.save()
  res.status(StatusCodes.OK).json({ user })
})

const delete_user = async_wrapper(async (req, res) => {
  const { user } = req
  await user.deleteOne()
  res.status(StatusCodes.OK).json({ user })
})

module.exports = {
  register_user,
  login_user,
  logout_user,
  logout_all_user,
  get_user,
  update_user,
  delete_user,
}
