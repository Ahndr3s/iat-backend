//index.js

const express = require('express')
const { dbConnection } = require('./database/config')
const cors = require('cors')
const fileUpload = require('express-fileupload')
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
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

app.use(fileUpload({ 
    createParentPath: true, 
    tempFileDir: "/tmp/", 
    useTempFiles: true,
    limits: { fileSize: 50 * 1024 * 1024 } // limit file size to 50MB
}));

// ROUTES
app.use('/api/auth', require('./routes/auth'))
//TODO: CRUD courses
app.use('/api/courses', require('./routes/courses'))
//TODO: CRUD videos
app.use('/api/videos', require('./routes/videos'))
//TODO: CRUD uploads
app.use('/api/uploads', require('./routes/uploads'))

// REQUESTS LISTENING
app.listen(process.env.PORT, () => {
    console.log(`Server running on port: ${process.env.PORT}`)
})
