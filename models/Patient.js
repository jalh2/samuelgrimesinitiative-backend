const mongoose = require('mongoose');

const clientPersonalInformationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    phoneNumber: { type: String },
}, { _id: false });

const parentGuardianInformationSchema = new mongoose.Schema({
    guardian1: {
        name: { type: String },
        contact: { type: String },
        relationship: { type: String },
    },
}, { _id: false });

const acutePhaseSchema = new mongoose.Schema({
    medicalConditions: { type: String },
    medications: { type: String },
    allergies: { type: String },
}, { _id: false });

const rehabilitativePhaseSchema = new mongoose.Schema({
    referralSource: { type: String },
    reasonForEnrollment: { type: String },
    goals: { type: String },
    notes: { type: String },
}, { _id: false });

const patientSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    profilePicture: { type: String }, // Base64 encoded string
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Completed', 'Dropped Out'],
        default: 'Active'
    },
    clientPersonalInformation: clientPersonalInformationSchema,
    parentGuardianInformation: parentGuardianInformationSchema,
    acutePhase: acutePhaseSchema,
    rehabilitativePhase: rehabilitativePhaseSchema
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
