const Donation = require('../models/Donation');

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private/Financial
exports.getAllDonations = async (req, res) => {
    try {
        const { page = 1, limit = 10, search } = req.query;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;

        const query = {};
        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { purpose_of_donation: regex },
                { donor_contact: regex },
                { signed_by: regex },
            ];
        }

        const total = await Donation.countDocuments(query);
        const donations = await Donation.find(query)
            .sort({ createdAt: -1 })
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            data: {
                donations,
                total,
                totalPages: Math.max(1, Math.ceil(total / limitNum)),
                page: pageNum,
                limit: limitNum,
            },
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single donation by ID
// @route   GET /api/donations/:id
// @access  Private/Financial
exports.getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.status(200).json({ success: true, data: donation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new donation
// @route   POST /api/donations
// @access  Private/Financial
exports.createDonation = async (req, res) => {
    try {
        const {
            date,
            purpose_of_donation,
            amount_donated_words,
            amount_donated_figures,
            donor_contact,
            items_donated,
            signed_by,
            signed_date,
            received_by,
        } = req.body;

        const newDonation = new Donation({
            date,
            purpose_of_donation,
            amount_donated_words,
            amount_donated_figures,
            donor_contact,
            items_donated,
            signed_by,
            signed_date,
            received_by,
        });

        const savedDonation = await newDonation.save();
        res.status(201).json({ success: true, data: savedDonation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a donation
// @route   PUT /api/donations/:id
// @access  Private/Financial
exports.updateDonation = async (req, res) => {
    try {
        const updatedDonation = await Donation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedDonation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.status(200).json({ success: true, data: updatedDonation });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a donation
// @route   DELETE /api/donations/:id
// @access  Private/Financial
exports.deleteDonation = async (req, res) => {
    try {
        const deleted = await Donation.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }
        res.status(200).json({ success: true, message: 'Donation removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
