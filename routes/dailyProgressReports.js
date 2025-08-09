const express = require('express');
const router = express.Router();
const {
    getAllDailyProgressReports,
    getDailyProgressReportById,
    createDailyProgressReport,
    updateDailyProgressReport,
    deleteDailyProgressReport,
    getReportsForPatient,
    getMyReports
} = require('../controllers/dailyProgressReportController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Patient self reports route (allow patients to access their own reports)
router.get('/me', protect, authorize('Patient', 'Admin', 'Executive Director', 'Mental Health Counselor'), getMyReports);

// All remaining routes are protected and restricted to authorized staff
router.use(protect, authorize('Admin', 'Executive Director', 'Mental Health Counselor'));

router.route('/')
    .get(getAllDailyProgressReports)
    .post(createDailyProgressReport);

// Route to get all reports for a specific patient
router.route('/patient/:patientId')
    .get(getReportsForPatient);

router.route('/:id')
    .get(getDailyProgressReportById)
    .put(updateDailyProgressReport)
    .delete(deleteDailyProgressReport);

module.exports = router;
