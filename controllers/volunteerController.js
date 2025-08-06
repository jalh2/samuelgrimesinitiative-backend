const Volunteer = require('../models/Volunteer');

// Get all volunteers (admin only)
const getVolunteers = async (req, res) => {
    try {
        const volunteers = await Volunteer.find().sort({ createdAt: -1 });
        res.json(volunteers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single volunteer
const getVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findById(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new volunteer submission
const createVolunteer = async (req, res) => {
    try {
        const volunteer = new Volunteer(req.body);
        const savedVolunteer = await volunteer.save();
        res.status(201).json(savedVolunteer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update volunteer
const updateVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.json(volunteer);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete volunteer
const deleteVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
        if (!volunteer) {
            return res.status(404).json({ message: 'Volunteer not found' });
        }
        res.json({ message: 'Volunteer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getVolunteers,
    getVolunteer,
    createVolunteer,
    updateVolunteer,
    deleteVolunteer
};
