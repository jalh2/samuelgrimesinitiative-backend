const express = require('express');
const router = express.Router();
const {
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonation,
    deleteDonation
} = require('../controllers/donationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are protected and restricted to financial staff
router.use(protect, authorize('Admin', 'Executive Director', 'Financial Controller'));

router.route('/')
    .get(getAllDonations)
    .post(createDonation);

router.route('/:id')
    .get(getDonationById)
    .put(updateDonation)
    .delete(deleteDonation);

module.exports = router;
