const mongoose = require('mongoose');

const cashRequestItemSchema = new mongoose.Schema({
    item: Number,
    description: { type: String, required: true },
    amount_requested: { type: Number, required: true }
}, { _id: false });

const cashSpentItemSchema = new mongoose.Schema({
    item: Number,
    vendor_name: { type: String },
    description: { type: String, required: true },
    amount_spent: { type: Number, required: true },
    receipt_image: { type: String } // Base64 encoded string
}, { _id: false });

const paymentRequestSchema = new mongoose.Schema({
    department_requesting: { type: String, required: true },
    requested_by: { type: String, required: true },
    date: { type: Date, required: true },
    requesting_money_for: { type: String },
    budget_ref_no: { type: String },
    who_should_receive_payment: { type: String },
    emergency: { type: Boolean },

    cash_request_items: [cashRequestItemSchema],
    total_cash_advance_requested: { type: Number },

    executive_director_signature: { type: String },
    department_head_signature: { type: String },

    cash_spent_items: [cashSpentItemSchema],
    total_spent: { type: Number },
    cash_advance_received: { type: Number },
    unspent_amount: { type: Number },
    comment: { type: String },

    approval_signatures: {
        executive_director_signature: { type: String },
        department_head_signature: { type: String },
        operation_coordinator_signature: { type: String }
    },

    recipient: {
        name: { type: String },
        signature: { type: String },
        contact: { type: String }
    }
}, { timestamps: true });

module.exports = mongoose.model('PaymentRequest', paymentRequestSchema);
