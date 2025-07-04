const express = require('express');
const router = express.Router();
const {
    staffCheckIn,
    staffCheckOut,
    getStaffAttendance,
    getMyAttendance
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Staff check-in and check-out
router.post('/staff/check-in', protect, authorize('Staff', 'Admin', 'Executive Director', 'Financial Controller', 'Mental Health Counselor'), staffCheckIn);
router.post('/staff/check-out', protect, authorize('Staff', 'Admin', 'Executive Director', 'Financial Controller', 'Mental Health Counselor'), staffCheckOut);

// Get my own attendance
router.get('/staff/me', protect, authorize('Staff', 'Admin', 'Executive Director', 'Financial Controller', 'Mental Health Counselor'), getMyAttendance);

// Get all staff attendance (Admin only)
router.get('/staff', protect, authorize('Admin', 'Executive Director'), getStaffAttendance);

module.exports = router;
