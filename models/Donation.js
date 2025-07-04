const mongoose = require('mongoose');

const itemDonatedSchema = new mongoose.Schema({
    description: { type: String, required: true },
    quantity: { type: String, required: true },
    value_of_donation: { type: Number, required: true },
    comment: { type: String }
}, { _id: false });

const receivedBySchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    position: { type: String, required: true },
    date: { type: Date, required: true }
}, { _id: false });

const donationSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    purpose_of_donation: { type: String, required: true },
    amount_donated_words: { type: String, required: true },
    amount_donated_figures: { type: Number, required: true },
    donor_contact: { type: String, required: true },
    items_donated: [itemDonatedSchema],
    signed_by: { type: String, required: true },
    signed_date: { type: Date, required: true },
    received_by: [receivedBySchema]
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
