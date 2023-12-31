const ToDo = require('../models/to_do')
const async_wrapper = require('../middleware/async_wrapper')
const { StatusCodes } = require('http-status-codes')
const { Bad_Request, Not_Found } = require('../errors')

const create_to_do = async_wrapper(async (req, res) => {
  const to_do = new ToDo({
    ...req.body,
    owner: req.user._id,
  })
  await to_do.save()
  res.status(StatusCodes.CREATED).json(to_do)
})

const get_all_to_do = async_wrapper(async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  await req.user.populate({
    path: 'to_do',
    match,
    options: {
      limit: parseInt(req.query.limit),
      skip: parseInt(req.query.skip),
      sort,
    },
  })
  res.status(StatusCodes.OK).json(req.user.to_do)
})

const get_single_to_do = async_wrapper(async (req, res, next) => {
  const { id: todo_id } = req.params
  const to_do = await ToDo.findOne({ _id: todo_id, owner: req.user._id })
  if (!to_do) {
    return next(new Not_Found(`To do with id ${todo_id} not found`))
  }
  res.json(to_do)
})

const update_to_do = async_wrapper(async (req, res, next) => {
  const { id: todo_id } = req.params
  const { _id: user_id } = req.user
  const updates = Object.keys(req.body)
  const allowed_updates = ['title', 'description', 'completed']
  const is_valid_operation = updates.every((update) =>
    allowed_updates.includes(update)
  )
  if (!is_valid_operation) return next(new Bad_Request('Invalid updates'))

  const to_do = await ToDo.findOne({ _id: todo_id, owner: user_id })
  if (!to_do) {
    // return res.status(404).json({ message: 'To do not found' })
    return next(new Not_Found(`To do with id ${todo_id} not found`))
  }
  updates.forEach((update) => (to_do[update] = req.body[update]))
  await to_do.save()
  res.status(StatusCodes.OK).json(to_do)
})

const delete_to_do = async_wrapper(async (req, res, next) => {
  const { id: todo_id } = req.params
  const { _id: user_id } = req.user
  const to_do = await ToDo.findOneAndDelete({ _id: todo_id, owner: user_id })
  if (!to_do) {
    return next(new Not_Found(`To do with id ${todo_id} not found`))
  }
  res.json(to_do)
})

module.exports = {
  create_to_do,
  get_all_to_do,
  get_single_to_do,
  update_to_do,
  delete_to_do,
}
