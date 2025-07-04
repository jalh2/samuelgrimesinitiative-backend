const PaymentRequest = require('../models/PaymentRequest');

// @desc    Get all payment requests
// @route   GET /api/payment-requests
// @access  Private/Financial
exports.getAllPaymentRequests = async (req, res) => {
    try {
        const requests = await PaymentRequest.find({}).populate('requester', 'staffInfo.fullName');
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single payment request by ID
// @route   GET /api/payment-requests/:id
// @access  Private/Financial
exports.getPaymentRequestById = async (req, res) => {
    try {
        const request = await PaymentRequest.findById(req.params.id).populate('requester', 'staffInfo.fullName');
        if (!request) {
            return res.status(404).json({ message: 'Payment request not found' });
        }
        res.status(200).json(request);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new payment request
// @route   POST /api/payment-requests
// @access  Private/Financial
exports.createPaymentRequest = async (req, res) => {
    const { cashRequest, itemsSpent, signatures } = req.body;

    try {
        const newRequest = new PaymentRequest({
            requester: req.user._id,
            cashRequest,
            itemsSpent,
            signatures
        });

        if (req.file) {
            newRequest.receiptImage = req.file.buffer.toString('base64');
        }

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a payment request
// @route   PUT /api/payment-requests/:id
// @access  Private/Financial
exports.updatePaymentRequest = async (req, res) => {
    const { cashRequest, itemsSpent, signatures } = req.body;
    const updateData = { cashRequest, itemsSpent, signatures };

    if (req.file) {
        updateData.receiptImage = req.file.buffer.toString('base64');
    }

    try {
        const updatedRequest = await PaymentRequest.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Payment request not found' });
        }
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a payment request
// @route   DELETE /api/payment-requests/:id
// @access  Private/Financial
exports.deletePaymentRequest = async (req, res) => {
    try {
        const request = await PaymentRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Payment request not found' });
        }
        await request.remove();
        res.status(200).json({ message: 'Payment request removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
