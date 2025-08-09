const PaymentRequest = require('../models/PaymentRequest');

// @desc    Get all payment requests
// @route   GET /api/payment-requests
// @access  Private/Financial
exports.getAllPaymentRequests = async (req, res) => {
    try {
        // Simple pagination support
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        if (req.query.search) {
            const regex = new RegExp(req.query.search, 'i');
            query.$or = [
                { department_requesting: regex },
                { requested_by: regex },
                { requesting_money_for: regex }
            ];
        }

        const [requests, total] = await Promise.all([
            PaymentRequest.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
            PaymentRequest.countDocuments(query)
        ]);

        res.status(200).json({
            success: true,
            data: requests,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get a single payment request by ID
// @route   GET /api/payment-requests/:id
// @access  Private/Financial
exports.getPaymentRequestById = async (req, res) => {
    try {
        const request = await PaymentRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Payment request not found' });
        }
        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Create a new payment request
// @route   POST /api/payment-requests
// @access  Private/Financial
exports.createPaymentRequest = async (req, res) => {
    try {
        // Accept payload matching the schema coming from frontend form
        const payload = req.body || {};

        // Ensure numeric fields are numbers (when JSON arrives as strings)
        const toNumber = (v) => (v === '' || v === null || v === undefined ? undefined : Number(v));

        const doc = {
            department_requesting: payload.department_requesting,
            requested_by: payload.requested_by,
            date: payload.date,
            requesting_money_for: payload.requesting_money_for,
            budget_ref_no: payload.budget_ref_no,
            who_should_receive_payment: payload.who_should_receive_payment,
            emergency: payload.emergency,

            cash_request_items: Array.isArray(payload.cash_request_items)
                ? payload.cash_request_items.map((it, idx) => ({
                    item: toNumber(it.item) ?? idx + 1,
                    description: it.description,
                    amount_requested: toNumber(it.amount_requested)
                })) : [],
            total_cash_advance_requested: toNumber(payload.total_cash_advance_requested),

            executive_director_signature: payload.executive_director_signature,
            department_head_signature: payload.department_head_signature,

            cash_spent_items: Array.isArray(payload.cash_spent_items)
                ? payload.cash_spent_items.map((it, idx) => ({
                    item: toNumber(it.item) ?? idx + 1,
                    vendor_name: it.vendor_name,
                    description: it.description,
                    amount_spent: toNumber(it.amount_spent),
                    // If using multer later, map file to base64; for now keep any provided string
                    receipt_image: it.receipt_image
                })) : [],
            total_spent: toNumber(payload.total_spent),
            cash_advance_received: toNumber(payload.cash_advance_received),
            unspent_amount: toNumber(payload.unspent_amount),
            comment: payload.comment,

            approval_signatures: payload.approval_signatures || {},
            recipient: payload.recipient || {}
        };

        const savedRequest = await PaymentRequest.create(doc);
        res.status(201).json({ success: true, data: savedRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update a payment request
// @route   PUT /api/payment-requests/:id
// @access  Private/Financial
exports.updatePaymentRequest = async (req, res) => {
    try {
        const payload = req.body || {};
        const toNumber = (v) => (v === '' || v === null || v === undefined ? undefined : Number(v));

        const updateData = {
            department_requesting: payload.department_requesting,
            requested_by: payload.requested_by,
            date: payload.date,
            requesting_money_for: payload.requesting_money_for,
            budget_ref_no: payload.budget_ref_no,
            who_should_receive_payment: payload.who_should_receive_payment,
            emergency: payload.emergency,

            cash_request_items: Array.isArray(payload.cash_request_items)
                ? payload.cash_request_items.map((it, idx) => ({
                    item: toNumber(it.item) ?? idx + 1,
                    description: it.description,
                    amount_requested: toNumber(it.amount_requested)
                })) : undefined,
            total_cash_advance_requested: toNumber(payload.total_cash_advance_requested),

            executive_director_signature: payload.executive_director_signature,
            department_head_signature: payload.department_head_signature,

            cash_spent_items: Array.isArray(payload.cash_spent_items)
                ? payload.cash_spent_items.map((it, idx) => ({
                    item: toNumber(it.item) ?? idx + 1,
                    vendor_name: it.vendor_name,
                    description: it.description,
                    amount_spent: toNumber(it.amount_spent),
                    receipt_image: it.receipt_image
                })) : undefined,
            total_spent: toNumber(payload.total_spent),
            cash_advance_received: toNumber(payload.cash_advance_received),
            unspent_amount: toNumber(payload.unspent_amount),
            comment: payload.comment,

            approval_signatures: payload.approval_signatures,
            recipient: payload.recipient
        };

        // Remove undefined fields to avoid overwriting unintentionally
        Object.keys(updateData).forEach((k) => updateData[k] === undefined && delete updateData[k]);

        const updatedRequest = await PaymentRequest.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        if (!updatedRequest) {
            return res.status(404).json({ success: false, message: 'Payment request not found' });
        }
        res.status(200).json({ success: true, data: updatedRequest });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Delete a payment request
// @route   DELETE /api/payment-requests/:id
// @access  Private/Financial
exports.deletePaymentRequest = async (req, res) => {
    try {
        const request = await PaymentRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ success: false, message: 'Payment request not found' });
        }
        await request.remove();
        res.status(200).json({ success: true, message: 'Payment request removed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
