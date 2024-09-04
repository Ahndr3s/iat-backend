const { Router } = require("express");
const {check} = require('express-validator');
const router = Router();
const { uploadFile, updateImage, showImage, updateImageCloudinary } = require("../controllers/uploadsController");
const { allowedCollections } = require("../helpers");
const {  validateFields, validateUploads } = require("../middlewares");
const cloudinary = require("../cloudinary/cloudinary");

// UPLOAD IMAGE ON SPECIFIED MODEL
router.post('/', validateUploads ,uploadFile)
// router.post('/', uploadFile)

// UPDATE IMAGE O SPECIFIED MODEL
router.put('/:collection/:id', [
    // validateUploads, 
    check('id', 'This is not a mongo id').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'courses'])),
    validateFields,
// ], updateImage)
], updateImageCloudinary)

// GET IMAGES OF SPECIFIED MODEL
router.get('/:collection/:id', [
    check('id', 'This is not a mongo id').isMongoId(),
    check('collection').custom(c => allowedCollections(c, ['users', 'courses'])),
    validateFields,
], showImage)


router.delete('/:collection/:id', async (req, res) => {
// router.post( '/api/courses/${activeCourse.id}', async (req, res) => {
    const { public_id } = req.body;
  
    try {
      const result = await cloudinary.uploader.destroy(public_id);
      res.status(200).json({ result });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

module.exports = router