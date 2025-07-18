const express = require('express');
const router = express.Router();
const {
    getAllGroupProgressReports,
    getGroupProgressReportById,
    createGroupProgressReport,
    updateGroupProgressReport,
    deleteGroupProgressReport
} = require('../controllers/groupProgressReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to authorized staff
router.use(protect, authorize('Admin', 'Executive Director', 'Mental Health Counselor'));

router.route('/')
    .get(getAllGroupProgressReports)
    .post(createGroupProgressReport);

router.route('/:id')
    .get(getGroupProgressReportById)
    .put(updateGroupProgressReport)
    .delete(deleteGroupProgressReport);

module.exports = router;
