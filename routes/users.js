const express = require('express');
const router = express.Router();
const {
    getMe,
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
