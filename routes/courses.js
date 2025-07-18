const express = require('express');
const router = express.Router();
const {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Admin routes
router.use(protect, authorize('admin', 'executive director'));

router.post('/', createCourse);
router.put('/:id', updateCourse);
router.delete('/:id', deleteCourse);

module.exports = router;
