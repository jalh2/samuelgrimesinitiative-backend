const express = require('express');
const router = express.Router();
const {
  getAllSelfAssessments,
  getMySelfAssessments,
  getAssessmentsForPatient,
  getSelfAssessmentById,
  createSelfAssessment,
  updateSelfAssessment,
  deleteSelfAssessment,
} = require('../controllers/selfAssessmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes protected
router.use(protect);

// Patient access to their own assessments
router.get('/me', authorize('patient', 'admin', 'mental health counselor', 'nurse'), getMySelfAssessments);

// Staff/admin access
router.get('/', authorize('admin', 'mental health counselor', 'nurse'), getAllSelfAssessments);
router.get('/patient/:patientId', authorize('admin', 'mental health counselor', 'nurse'), getAssessmentsForPatient);
router.get('/:id', authorize('admin', 'mental health counselor', 'nurse', 'patient'), getSelfAssessmentById);

// Create: allow patient, counselor, nurse, admin
router.post('/', authorize('patient', 'admin', 'mental health counselor', 'nurse'), createSelfAssessment);

// Update restricted to staff/admin
router.put('/:id', authorize('admin', 'mental health counselor', 'nurse'), updateSelfAssessment);

// Delete restricted to admin
router.delete('/:id', authorize('admin'), deleteSelfAssessment);

module.exports = router;
