const Course = require('./Courses')
const User  = require('./User')
const Video = require('./Videos')

module.exports = {
    Course, 
    ...User, 
    ...Video
}