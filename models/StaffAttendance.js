const mongoose = require('mongoose');

const staffAttendanceSchema = new mongoose.Schema({
    staffId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    checkInTime: {
        type: Date,
        required: true
    },
    checkOutTime: {
        type: Date
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'Late', 'On Leave'],
        default: 'Present'
    }
}, { timestamps: true });

// Ensure that a staff member can only have one attendance record per day
staffAttendanceSchema.index({ staffId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('StaffAttendance', staffAttendanceSchema);
