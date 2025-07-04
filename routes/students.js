const express = require('express');
const router = express.Router();
const {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to admins/staff
router.use(protect, authorize('Admin', 'Executive Director'));

router.route('/')
    .post(createStudent)
    .get(getAllStudents);

router.route('/:id')
    .get(getStudentById)
    .put(updateStudent)
    .delete(deleteStudent);

module.exports = router;
