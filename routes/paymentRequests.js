const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    getAllPaymentRequests,
    getPaymentRequestById,
    createPaymentRequest,
    updatePaymentRequest,
    deletePaymentRequest
} = require('../controllers/paymentRequestController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Configure multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// All routes are protected and restricted to financial staff
router.use(protect, authorize('Admin', 'Executive Director', 'Financial Controller'));

router.route('/')
    .get(getAllPaymentRequests)
    .post(upload.single('receiptImage'), createPaymentRequest);

router.route('/:id')
    .get(getPaymentRequestById)
    .put(upload.single('receiptImage'), updatePaymentRequest)
    .delete(deletePaymentRequest);

module.exports = router;
