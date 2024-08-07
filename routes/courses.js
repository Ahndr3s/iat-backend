const { Router } = require('express')
const router = Router()
const { check } = require('express-validator')
const { validateJWT } = require('../middlewares/validate-jwt')
const { validateFields } = require('../middlewares/validate-fields')
const { getCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/coursesController')
const multer = require('multer');

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads'); // Ruta donde se guardarán los archivos
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

const upload = multer({ storage: storage });

// GET COURSES
router.get('/', getCourses)

// EVERY ROUTE HAS TO BE VALIDATED WITH JWT
router.use(validateJWT)

// CREATE COURSES
router.post('/', upload.single('img'), [
    check('type', 'The content must have a type!!').not().isEmpty(),
    check('name', 'You need to add a title!!').not().isEmpty(),
    check('btntxt', 'The button needs a text!!').not().isEmpty(),
    check('Coursedata', 'The course needs to have details!!').not().isEmpty(),
    // check('id', 'The course needs to have id!!').not().isEmpty(),    
    validateFields
], createCourse)

// UPDATE COURSES
router.put('/:id', [
    check('type', 'The content must have a type!!').not().isEmpty(),
    check('name', 'You need to add a title!!').not().isEmpty(),
    check('btntxt', 'The button needs a text!!').not().isEmpty(),
    check('Coursedata', 'The course needs to have details!!').not().isEmpty(),
    validateFields
], updateCourse)

// DELETE COURSES
router.delete('/:id', deleteCourse)

module.exports = router
