const mongoose = require('mongoose');

const groupProgressReportSchema = new mongoose.Schema({
    groupName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    facilitator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Staff member who facilitated the group
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    objective: {
        type: String
    },
    process: {
        type: String // Description of the session process
    },
    materialsUsed: {
        type: String
    },
    groupDynamics: {
        type: String
    },
    evaluation: {
        type: String
    },
    recommendation: {
        type: String
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }],
    facilitatorSignature: {
        type: String // Name of the facilitator signing
    },
    supervisorSignature: {
        type: String // Name of the supervisor signing
    },
    status: {
        type: String,
        enum: ['Pending', 'Submitted', 'Overdue'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('GroupProgressReport', groupProgressReportSchema);
