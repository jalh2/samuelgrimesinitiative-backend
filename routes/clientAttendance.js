const express = require('express');
const router = express.Router();
const {
    getAllClientAttendanceReports,
    getClientAttendanceReportById,
    createClientAttendanceReport,
    updateClientAttendanceReport,
    deleteClientAttendanceReport
} = require('../controllers/clientAttendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to authorized staff
router.use(protect, authorize('Admin', 'Executive Director', 'Mental Health Counselor'));

router.route('/')
    .get(getAllClientAttendanceReports)
    .post(createClientAttendanceReport);

router.route('/:id')
    .get(getClientAttendanceReportById)
    .put(updateClientAttendanceReport)
    .delete(deleteClientAttendanceReport);

module.exports = router;
