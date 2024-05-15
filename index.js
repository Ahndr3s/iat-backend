const express = require('express')
const { dbConnection } = require('./database/config')
const cors = require('cors')
require('dotenv').config()

// CREATING EXPRESS SERVER
const app = express()

// DB CONNECTION
dbConnection()

// CORS
app.use(cors())

// PUBLIC DIRECTORY
app.use(express.static('public'))


// READING AND PARSING OF BODY REQUEST
app.use(express.json())

// ROUTES
app.use('/api/auth', require('./routes/auth'))
//TODO: CRUD courses
app.use('/api/courses', require('./routes/courses'))

// REQUESTS LISTENING
app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
})