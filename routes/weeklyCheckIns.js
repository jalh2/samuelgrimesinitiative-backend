const express = require('express');
const router = express.Router();
const {
  getAllWeeklyCheckIns,
  getCheckInsForPatient,
  getWeeklyCheckInById,
  createWeeklyCheckIn,
  updateWeeklyCheckIn,
  deleteWeeklyCheckIn,
} = require('../controllers/weeklyCheckInController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes protected
router.use(protect);

// Access for admin, counselors, nurses
router.get('/', authorize('admin', 'mental health counselor', 'nurse'), getAllWeeklyCheckIns);
router.get('/patient/:patientId', authorize('admin', 'mental health counselor', 'nurse'), getCheckInsForPatient);
router.get('/:id', authorize('admin', 'mental health counselor', 'nurse'), getWeeklyCheckInById);
router.post('/', authorize('admin', 'mental health counselor', 'nurse'), createWeeklyCheckIn);
router.put('/:id', authorize('admin', 'mental health counselor', 'nurse'), updateWeeklyCheckIn);
// Delete restricted to admin
router.delete('/:id', authorize('admin'), deleteWeeklyCheckIn);

module.exports = router;
