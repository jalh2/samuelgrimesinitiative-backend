const express = require('express');
const router = express.Router();
const {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatient,
    deletePatient,
    searchPatients,
    getActivePatientCount,
    getNewEnrollments,
    getSessionsCount,
    getProgressReportsDue,
    getMyProfile
} = require('../controllers/patientController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Patient self profile endpoint (allow patients to access their own profile)
router.get('/me', protect, authorize('patient', 'admin', 'executive director', 'mental health counselor'), getMyProfile);

// Protect all remaining routes and authorize specific roles
router.use(protect, authorize('admin', 'executive director', 'mental health counselor'));

router.route('/')
    .post(createPatient)
    .get(getAllPatients);

router.get('/search', searchPatients);

router.get('/stats/active-count', getActivePatientCount);
router.get('/stats/new-enrollments', getNewEnrollments);
router.get('/stats/sessions-count', getSessionsCount);
router.get('/stats/reports-due', getProgressReportsDue);

router.route('/:id')
    .get(getPatientById)
    .put(updatePatient)
    .delete(deletePatient);

module.exports = router;
