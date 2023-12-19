const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const {
  create_to_do,
  get_all_to_do,
  get_single_to_do,
  update_to_do,
  delete_to_do,
} = require('../controllers/to_do')

router.post('/', auth, create_to_do)
router.get('/', auth, get_all_to_do)
router.get('/:id', auth, get_single_to_do)
router.patch('/:id', auth, update_to_do)
router.delete('/:id', auth, delete_to_do)

module.exports = router
