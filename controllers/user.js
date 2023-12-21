const User = require('../models/user')
const async_wrapper = require('../middleware/async_wrapper')

const register_user = async_wrapper(async (req, res) => {
  const user = new User(req.body)
  await user.save()
  const token = await user.generate_auth_token()
  res.status(201).json({ user, token })
})

const login_user = async_wrapper(async (req, res) => {
  const { email, password } = req.body
  const user = await User.find_by_credentials(email, password)
  const token = await user.generate_auth_token()
  res.json({ user, token })
})

const logout_user = async_wrapper(async (req, res) => {
  const { user, token } = req
  user.tokens = user.tokens.filter((t) => t.token !== token)
  await user.save()
  res.json({ message: 'Logout user' })
})

const logout_all_user = async_wrapper(async (req, res) => {
  const { user } = req
  user.tokens = []
  await user.save()
  res.json({ message: 'Logout all user' })
})

const get_user = async (req, res) => {
  res.send(req.user)
}

const update_user = async_wrapper(async (req, res) => {
  const updates = Object.keys(req.body)
  const allowed_updates = ['name', 'email', 'password']
  const is_valid_operation = updates.every((update) =>
    allowed_updates.includes(update)
  )
  if (!is_valid_operation) {
    return res.status(400).json({ error: 'Invalid updates!' })
  }
  const { user } = req
  updates.forEach((update) => (user[update] = req.body[update]))
  await user.save()
  res.json(user)
})

const delete_user = async_wrapper(async (req, res) => {
  const { user } = req
  await user.deleteOne()
  res.json(user)
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
