const mongoose = require('mongoose');

const dailyAttendanceSchema = new mongoose.Schema({
    morning: { type: Boolean, default: false },
    night: { type: Boolean, default: false }
}, { _id: false });

const clientAttendanceSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    name: { type: String, required: true },
    attendance: {
        monday: dailyAttendanceSchema,
        tuesday: dailyAttendanceSchema,
        wednesday: dailyAttendanceSchema,
        thursday: dailyAttendanceSchema,
        friday: dailyAttendanceSchema,
        saturday: dailyAttendanceSchema,
        sunday: dailyAttendanceSchema
    }
}, { _id: false });

const signatureSchema = new mongoose.Schema({
    name: { type: String, required: true },
    signed: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
}, { _id: false });

const clientAttendanceReportSchema = new mongoose.Schema({
    month: { type: String, required: true },
    weekNumber: { type: Number, required: true },
    roomName: { type: String },
    date: { type: Date, required: true },
    totalPerson: { type: Number },
    genderCount: {
        male: { type: Number },
        female: { type: Number }
    },
    clients: [clientAttendanceSchema],
    note: { type: String },
    securityOnShift: signatureSchema,
    verifiedByNextShift: signatureSchema,
    attestedBy: signatureSchema
}, { timestamps: true });

module.exports = mongoose.model('ClientAttendanceReport', clientAttendanceReportSchema);
