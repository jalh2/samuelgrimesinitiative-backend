const express = require('express');
const router = express.Router();
const {
  getAllProgressTrackers,
  getProgressTrackersForPatient,
  getProgressTrackerById,
  createProgressTracker,
  updateProgressTracker,
  deleteProgressTracker,
} = require('../controllers/progressTrackerController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes protected
router.use(protect);

router.get('/', authorize('admin', 'mental health counselor', 'nurse'), getAllProgressTrackers);
router.get('/patient/:patientId', authorize('admin', 'mental health counselor', 'nurse'), getProgressTrackersForPatient);
router.get('/:id', authorize('admin', 'mental health counselor', 'nurse'), getProgressTrackerById);
router.post('/', authorize('admin', 'mental health counselor', 'nurse'), createProgressTracker);
router.put('/:id', authorize('admin', 'mental health counselor', 'nurse'), updateProgressTracker);
router.delete('/:id', authorize('admin'), deleteProgressTracker);

module.exports = router;
