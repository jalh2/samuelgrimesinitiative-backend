const express = require('express');
const router = express.Router();
const volunteerController = require('../controllers/volunteerController');

// Public routes
router.post('/', volunteerController.createVolunteer);

// Admin routes
router.get('/', volunteerController.getVolunteers);
router.get('/:id', volunteerController.getVolunteer);
router.put('/:id', volunteerController.updateVolunteer);
router.delete('/:id', volunteerController.deleteVolunteer);

module.exports = router;
