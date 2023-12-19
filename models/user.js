const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const user_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      validate: (value) => {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password cannot contain "password"')
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

// virtual property
user_schema.virtual('to_do', {
  ref: 'To_do',
  localField: '_id',
  foreignField: 'owner',
})

// custom method to find user by email and password
user_schema.statics.find_by_credentials = async (email, password) => {
  const user = await User.findOne({ email })
  if (!user) throw new Error('Unable to login')
  const is_match = await bcrypt.compare(password, user.password)
  if (!is_match) throw new Error('Unable to login')
  return user
}

// generate_auth_token
user_schema.methods.generate_auth_token = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
  user.tokens = user.tokens.concat({ token })
  await user.save()
  return token
}

// hash the plain text password before saving
user_schema.pre('save', async function (next) {
  const user = this
  if (user.isModified('password'))
    user.password = await bcrypt.hash(user.password, 8)

  next()
})

const User = mongoose.model('User', user_schema)
module.exports = User
