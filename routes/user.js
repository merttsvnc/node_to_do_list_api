const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const {
  register_user,
  login_user,
  logout_user,
  logout_all_user,
  get_user,
  update_user,
  delete_user,
} = require('../controllers/user')

router.post('/register', register_user)
router.post('/login', login_user)
router.post('/logout', auth, logout_user)
router.post('/logoutAll', auth, logout_all_user)
router.get('/me', auth, get_user)
router.patch('/me', auth, update_user)
router.delete('/me', auth, delete_user)

module.exports = router
