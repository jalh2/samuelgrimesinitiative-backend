const express = require('express');
const router = express.Router();
const {
    getNavigationPages,
    getContentByPage,
    createContent,
    updateContent,
    deleteContent,
    getAllContent
} = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/authMiddleware');

// @route   GET /api/content/navigation
// @desc    Get a list of pages for the navigation
// @access  Public
router.get('/navigation', getNavigationPages);

// @route   GET /api/content/:page
// @desc    Get all content for a specific page
// @access  Public
router.get('/:page', getContentByPage);

// --- Admin Routes ---
router.use(protect, authorize('admin', 'executive director'));

// @route   GET /api/content
// @desc    Get all website content
// @access  Private/Admin
router.get('/', getAllContent);

// @route   POST /api/content
// @desc    Create a new content block
// @access  Private/Admin
router.post('/', createContent);

// @route   PUT /api/content/:id
// @desc    Update a content block
// @access  Private/Admin
router.put('/:id', updateContent);

// @route   DELETE /api/content/:id
// @desc    Delete a content block
// @access  Private/Admin
router.delete('/:id', deleteContent);

module.exports = router;
