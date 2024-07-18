const { response } = require("express");
const Course = require("../models/Courses");

const getCourses = async(req, res = response) => {
    const courses = await Course.find().populate('user', 'name')

    return res.json({
        ok: true,
        courses
    })
}

const createCourse = async(req, res = response) => {
    const course = new Course(req.body)
    
    if (req.file) {
        course.img = req.file.path; // Guarda la ruta del archivo en el campo img
    }
    
    try {
        course.user = req.uuid
        const savedEvent = await course.save()
        res.json({
            ok: true,
            event: savedEvent
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the admin'
        })
    }
}

const updateCourse = async(req, res = response) => {

    const courseId = req.params.id
    const uuid = req.uuid

    try {
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                ok: false,
                msg: 'Theres is no course with the given ID!!!'
            })
        }

        if (course.user.toString() !== uuid){
            return res.status(401).json({
                ok: false,
                msg: 'This user cannot update that course!!'
            })
        }

        const newCourse = {
            ...req.body,
            user: uuid
        }

        const updatedCourse = await Course.findByIdAndUpdate(courseId, newCourse, {new: true})

        res.json({
            ok: true,
            course: updatedCourse
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the admin'
        })
    }
}

const deleteCourse = async(req, res = response) => {
    const courseId = req.params.id
    const uuid = req.uuid

    try {
        const course = await Course.findById(courseId)
        if(!course){
            return res.status(404).json({
                ok: false,
                msg: 'Theres is no course with the given ID!!!'
            })
        }

        if (course.user.toString() !== uuid){
            return res.status(401).json({
                ok: false,
                msg: 'This user cannot delete that course!!'
            })
        }

        await Course.findByIdAndDelete(courseId)

        res.json({
            ok: true
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the admin'
        })
    }
}

module.exports = {getCourses, createCourse, updateCourse, deleteCourse}