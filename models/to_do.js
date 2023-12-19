const mongoose = require('mongoose')

const to_do_schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // This is how we reference another model
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const to_do = mongoose.model('To_do', to_do_schema)
module.exports = to_do
