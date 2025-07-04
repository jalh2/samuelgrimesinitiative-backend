const Donation = require('../models/Donation');

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private/Financial
exports.getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find({}).populate('receivedBy.staffId', 'staffInfo.fullName');
        res.status(200).json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single donation by ID
// @route   GET /api/donations/:id
// @access  Private/Financial
exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id).populate('receivedBy.staffId', 'staffInfo.fullName');
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.status(200).json(donation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private/Financial
exports.createDonation = async (req, res) => {
    const { itemDetails, donorInformation, receivedBy } = req.body;
    try {
        const newDonation = new Donation({
            itemDetails,
            donorInformation,
            receivedBy: {
                ...receivedBy,
                staffId: req.user._id // Automatically set the staffId to the logged-in user
            }
        });
        const savedDonation = await newDonation.save();
        res.status(201).json(savedDonation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a donation
// @route   PUT /api/donations/:id
// @access  Private/Financial
exports.updateDonation = async (req, res) => {
    try {
        const updatedDonation = await Donation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedDonation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.status(200).json(updatedDonation);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Private/Financial
exports.deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        await donation.remove();
        res.status(200).json({ message: 'Donation removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
