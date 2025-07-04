const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['Individual', 'Group', 'Family'],
        required: true
    },
    counselorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    notes: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
