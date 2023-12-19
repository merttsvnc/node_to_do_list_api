const ToDo = require('../models/to_do')

const create_to_do = async (req, res) => {
  const to_do = new ToDo({
    ...req.body,
    owner: req.user._id,
  })
  try {
    await to_do.save()
    res.status(201).json(to_do)
  } catch (error) {
    res.status(400).json({ error })
  }
}

const get_all_to_do = async (req, res) => {
  const match = {}
  const sort = {}

  if (req.query.completed) {
    match.completed = req.query.completed === 'true'
  }

  if (req.query.sortBy) {
    const parts = req.query.sortBy.split(':')
    sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
  }
  try {
    await req.user.populate({
      path: 'to_do',
      match,
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort,
      },
    })
    res.json(req.user.to_do)
  } catch (error) {
    res.status(500).json({ error })
  }
}

const get_single_to_do = async (req, res) => {
  const { id: todo_id } = req.params
  try {
    const to_do = await ToDo.findOne({ _id: todo_id, owner: req.user._id })
    if (!to_do) {
      return res.status(404).json({ message: 'To do not found' })
    }
    res.json(to_do)
  } catch (error) {
    res.status(500).json({ error })
  }
}

const update_to_do = async (req, res) => {
  const { id: todo_id } = req.params
  const { _id: user_id } = req.user
  const updates = Object.keys(req.body)
  const allowed_updates = ['title', 'description', 'completed']
  const is_valid_operation = updates.every((update) =>
    allowed_updates.includes(update)
  )
  if (!is_valid_operation)
    return res.status(400).json({ error: 'Invalid updates' })

  try {
    const to_do = await ToDo.findOne({ _id: todo_id, owner: user_id })
    if (!to_do) {
      return res.status(404).json({ message: 'To do not found' })
    }
    updates.forEach((update) => (to_do[update] = req.body[update]))
    await to_do.save()
    res.json(to_do)
  } catch (error) {
    res.status(500).json({ error })
  }
}

const delete_to_do = async (req, res) => {
  const { id: todo_id } = req.params
  const { _id: user_id } = req.user
  try {
    const to_do = await ToDo.findOneAndDelete({ _id: todo_id, owner: user_id })
    if (!to_do) {
      return res.status(404).json({ message: 'To do not found' })
    }
    res.json(to_do)
  } catch (error) {
    res.status(500).json({ error })
  }
}

module.exports = {
  create_to_do,
  get_all_to_do,
  get_single_to_do,
  update_to_do,
  delete_to_do,
}
