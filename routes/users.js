const express = require('express');
const router = express.Router();
const {
    getMe,
    getInstructors,
    adminTest,
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes below are protected
router.use(protect);

router.route('/me').get(getMe);

// Route to get instructors (accessible by admin and directors)
router.route('/instructors').get(authorize('admin', 'executive director'), getInstructors);

// Admin-only routes
router.use(authorize('admin', 'executive director'));

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .get(getUserById)
    .put(updateUser)
    .delete(deleteUser);

router.get('/admin-test', adminTest);

module.exports = router;
