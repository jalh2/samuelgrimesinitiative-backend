const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    uploadMaterial,
    getMaterialsByCourse,
    downloadMaterial,
    deleteMaterial,
    updateMaterial,
    getAllMaterials
} = require('../controllers/libraryController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Public Routes ---
router.get('/course/:courseId', getMaterialsByCourse);
router.get('/download/:id', downloadMaterial);

// --- Admin Routes ---
router.use(protect, authorize('admin', 'executive director'));

router.get('/', getAllMaterials);

// @route   POST /api/library/upload
// @desc    Upload a new library material
// @access  Private/Admin
router.post('/upload', upload.single('file'), uploadMaterial);

router.route('/:id')
    .put(updateMaterial)
    .delete(deleteMaterial);

module.exports = router;
