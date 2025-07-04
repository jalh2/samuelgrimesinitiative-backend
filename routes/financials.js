const express = require('express');
const router = express.Router();
const {
    getAllReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport
} = require('../controllers/financialController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to financial staff
router.use(protect, authorize('Admin', 'Executive Director', 'Financial Controller'));

router.route('/')
    .get(getAllReports)
    .post(createReport);

router.route('/:id')
    .get(getReportById)
    .put(updateReport)
    .delete(deleteReport);

module.exports = router;
