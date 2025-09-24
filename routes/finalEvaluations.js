const express = require('express');
const router = express.Router();
const {
  getAllFinalEvaluations,
  getMyFinalEvaluations,
  getFinalEvaluationsForPatient,
  getFinalEvaluationById,
  createFinalEvaluation,
  updateFinalEvaluation,
  deleteFinalEvaluation,
} = require('../controllers/finalEvaluationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes protected
router.use(protect);

// Patient access to their own records
router.get('/me', authorize('patient', 'admin', 'mental health counselor', 'nurse'), getMyFinalEvaluations);

// Staff/admin access
router.get('/', authorize('admin', 'mental health counselor', 'nurse'), getAllFinalEvaluations);
router.get('/patient/:patientId', authorize('admin', 'mental health counselor', 'nurse'), getFinalEvaluationsForPatient);
router.get('/:id', authorize('admin', 'mental health counselor', 'nurse', 'patient'), getFinalEvaluationById);

// Create: allow patient, counselor, nurse, admin
router.post('/', authorize('patient', 'admin', 'mental health counselor', 'nurse'), createFinalEvaluation);

// Update restricted to staff/admin
router.put('/:id', authorize('admin', 'mental health counselor', 'nurse'), updateFinalEvaluation);

// Delete restricted to admin
router.delete('/:id', authorize('admin'), deleteFinalEvaluation);

module.exports = router;
