const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to admins
router.use(protect, authorize('Admin', 'Executive Director'));

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private/Admin
router.route('/stats').get(getDashboardStats);

module.exports = router;
