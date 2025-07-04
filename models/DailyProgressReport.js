const mongoose = require('mongoose');

const dailyProgressReportSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Staff member who wrote the report
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    clientSituation: {
        type: String,
        required: true
    },
    actionTaken: {
        type: String,
        required: true
    },
    staffSignature: {
        type: String // Name of the staff member signing
    },
    clientSignature: {
        type: String // Name of the client signing
    },
    status: {
        type: String,
        enum: ['Pending', 'Submitted', 'Overdue'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('DailyProgressReport', dailyProgressReportSchema);
