const express = require('express');
const router = express.Router();
const {
    getAllAssessments,
    getAssessmentById,
    createAssessment,
    updateAssessment,
    deleteAssessment
} = require('../controllers/clientAssessmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protect all routes below
router.use(protect);

// @route   GET /api/client-assessments
// @desc    Get all client assessments
// @access  Private
router.get('/', authorize('Admin', 'Mental Health Counselor', 'Executive Director'), getAllAssessments);

// @route   GET /api/client-assessments/:id
// @desc    Get a single client assessment by ID
// @access  Private
router.get('/:id', authorize('Admin', 'Mental Health Counselor', 'Executive Director'), getAssessmentById);

// @route   POST /api/client-assessments
// @desc    Create a new client assessment
// @access  Private
router.post('/', authorize('Admin', 'Mental Health Counselor'), createAssessment);

// @route   PUT /api/client-assessments/:id
// @desc    Update a client assessment
// @access  Private
router.put('/:id', authorize('Admin', 'Mental Health Counselor'), updateAssessment);

// @route   DELETE /api/client-assessments/:id
// @desc    Delete a client assessment
// @access  Private
router.delete('/:id', authorize('Admin'), deleteAssessment);

module.exports = router;
