const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const { validateJWT } = require('../middlewares/validate-jwt')
const { validateFields } = require('../middlewares/validate-fields')
const { getVideos, createVideo, updateVideos, deleteVideo } = require('../controllers/videosController')




// GET VIDEOS
router.get('/', getVideos)

// EVERY ROUTE HAS TO BE VALIDATED WITH JWT
router.use(validateJWT)

// CREATE VIDEOS
router.post('/', [
    check('type', 'The content must have a type!!').not().isEmpty(),
    check('name', 'You need to add a title!!').not().isEmpty(),
    check('url', 'The video needs a url!!').not().isEmpty(),
    check('img', 'The video needs a thumbnail!!').not().isEmpty(),
    // check('id', 'The course needs to have id!!').not().isEmpty(),    
    validateFields
], createVideo)

// UPDATE VIDEOS
router.put('/:id', [
    check('type', 'The content must have a type!!').not().isEmpty(),
    check('name', 'You need to add a title!!').not().isEmpty(),
    check('url', 'The video needs a url!!').not().isEmpty(),
    check('img', 'The video needs a thumbnail!!').not().isEmpty(),
    validateFields
], updateVideos)

// DELETE VIDEOS
router.delete('/:id', deleteVideo)

module.exports = router
