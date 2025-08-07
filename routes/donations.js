const express = require('express');
const router = express.Router();
const {
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonation,
    deleteDonation
} = require('../controllers/donationController');
// const { authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(createDonation) 
    .get(getAllDonations);

router.route('/:id')
    .get(getDonationById)
    .put(updateDonation)
    .delete(deleteDonation);

module.exports = router;
