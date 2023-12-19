const User = require('../models/user')

const register_user = async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generate_auth_token()
    res.status(201).json({ user, token })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const login_user = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.find_by_credentials(email, password)
    const token = await user.generate_auth_token()
    res.json({ user, token })
  } catch (error) {
    res.status(400).json({ error })
  }
}

const logout_user = async (req, res) => {
  const { user, token } = req
  try {
    user.tokens = user.tokens.filter((t) => t.token !== token)
    await user.save()
    res.json({ message: 'Logout user' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const logout_all_user = async (req, res) => {
  const { user } = req
  try {
    user.tokens = []
    await user.save()
    res.json({ message: 'Logout all user' })
  } catch (error) {
    console.log('MERT DEBUG  20231219 (user.js/43) ', { Error: error })
    res.status(500).json({ error })
  }
}

const get_user = async (req, res) => {
  res.send(req.user)
}

const update_user = async (req, res) => {
  const updates = Object.keys(req.body)
  const allowed_updates = ['name', 'email', 'password']
  const is_valid_operation = updates.every((update) =>
    allowed_updates.includes(update)
  )
  if (!is_valid_operation) {
    return res.status(400).json({ error: 'Invalid updates!' })
  }
  const { user } = req
  try {
    updates.forEach((update) => (user[update] = req.body[update]))
    await user.save()
    res.json(user)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const delete_user = async (req, res) => {
  const { user } = req
  try {
    await user.deleteOne()
    res.json(user)
  } catch (error) {
    console.log('MERT DEBUG  20231219 (user.js/77) ', { Error: error })
    res.status(500).json({ error })
  }
}

module.exports = {
  register_user,
  login_user,
  logout_user,
  logout_all_user,
  get_user,
  update_user,
  delete_user,
}
