const { response } = require("express");
const Video = require("../models/Videos");

const getVideos = async(req, res = response) => {
    const videos = await Video.find().populate('user', 'name')

    return res.json({
        ok: true,
        videos
    })
}

const createVideo = async(req, res = response) => {
    const video = new Video(req.body)
    
    try {
        video.user = req.uuid
        const savedEvent = await video.save()
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

const updateVideos = async(req, res = response) => {

    const videoId = req.params.id
    const uuid = req.uuid

    try {
        const video = await Video.findById(videoId)
        if(!video){
            return res.status(404).json({
                ok: false,
                msg: 'Theres is no video with the given ID!!!'
            })
        }

        if (video.user.toString() !== uuid){
            return res.status(401).json({
                ok: false,
                msg: 'This user cannot update that video!!'
            })
        }

        const newVideo = {
            ...req.body,
            user: uuid
        }

        const updatedVideo = await Video.findByIdAndUpdate(videoId, newVideo, {new: true})

        res.json({
            ok: true,
            course: updatedVideo
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'Talk with the admin'
        })
    }
}

const deleteVideo = async(req, res = response) => {
    const videoId = req.params.id
    const uuid = req.uuid

    try {
        const video = await Video.findById(videoId)
        if(!video){
            return res.status(404).json({
                ok: false,
                msg: 'Theres is no course with the given ID!!!'
            })
        }

        if (video.user.toString() !== uuid){
            return res.status(401).json({
                ok: false,
                msg: 'This user cannot delete that video!!'
            })
        }

        await Video.findByIdAndDelete(videoId)

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

module.exports = {getVideos, createVideo, updateVideos, deleteVideo}