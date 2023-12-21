require('dotenv').config()
const express = require('express')
const app = express()
const user_router = require('./routes/user')
const to_do_router = require('./routes/to_do')
const connect_db = require('./config/db')
const not_found_route = require('./middleware/not_found')
const error_handler = require('./middleware/error_handler')

app.use(express.json())
app.use('/api/v1/user', user_router)
app.use('/api/v1/todos', to_do_router)
app.use(not_found_route)
app.use(error_handler)

const port = process.env.PORT || 3000
const start = async () => {
  try {
    await connect_db(process.env.MONGODB_URI)
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
