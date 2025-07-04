const mongoose = require('mongoose');

const personalInfoSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    dateOfBirth: { type: Date },
    nationality: { type: String },
    county: { type: String },
    educationalStatus: {
        type: String,
        enum: ['literate', 'not literate', 'elementary', 'jnr high', 'snr high', 'high sch graduate', 'college graduate', 'other']
    },
    vocationalSkill: { type: String }
}, { _id: false });

const guardianInfoSchema = new mongoose.Schema({
    name: { type: String },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    address: { type: String },
    relationship: { type: String },
    contact: { type: String }
}, { _id: false });

const studentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    personalInformation: personalInfoSchema,
    parentGuardianInformation: [guardianInfoSchema],
    courseOfStudy: {
        type: String,
        enum: [
            'Tailoring',
            'Bible Study',
            'Computer Science',
            'Carpentry',
            'Masonry',
            'Plumbing',
            'Cosmetology',
            'Baking',
            'Pastry',
            'Other'
        ],
        required: true
    },
    enrollmentStatus: {
        type: String,
        enum: ['Active', 'Completed', 'Dropped Out'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
