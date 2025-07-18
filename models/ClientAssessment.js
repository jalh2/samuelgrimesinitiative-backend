const mongoose = require('mongoose');

const ClientAssessmentSchema = new mongoose.Schema({
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    assessmentDate: {
        type: Date,
        default: Date.now
    },
    // Substance Use History
    substanceUseHistory: {
        primarySubstance: { type: String, required: true },
        otherSubstances: [String],
        ageOfFirstUse: Number,
        frequencyOfUse: String, // e.g., 'Daily', 'Weekly'
        previouslyTreated: Boolean,
        treatmentCenter: String
    },
    // Medical History
    medicalHistory: {
        currentMedication: [String],
        knownAllergies: [String],
        chronicConditions: [String],
        psychiatricDiagnosis: String,
        previousHospitalizationReason: String,
        hospitalizationDate: Date
    },
    // Mental and Emotional Assessment
    mentalEmotionalAssessment: {
        currentMood: String,
        historyOfViolence: String,
        historyOfSelfHarm: String,
        traumaticEvents: String
    },
    // Social and Environmental Assessment
    socialEnvironmentalAssessment: {
        livingSituation: String,
        employmentStatus: String,
        education: String,
        skills: String,
        professionDesires: String,
        legalIssues: String
    },
    // Family Relationship History
    familyRelationshipHistory: {
        maritalStatus: String,
        children: String,
        familyHistoryOfSubstanceAbuse: String,
        contactOfVictim: String
    },
    // Treatment Goals and Expectations
    treatmentGoals: {
        problemRelationships: String,
        shortTermGoals: String,
        longTermGoals: String,
        educationalGoals: String,
        selfEsteemReligiousGoals: String
    },
    // Consent
    consent: {
        clientConsent: { type: Boolean, required: true },
        consentDate: { type: Date, required: true },
        clientSignature: { type: String, required: true } // Assuming signature is stored as a string or path
    }
}, { timestamps: true });

module.exports = mongoose.model('ClientAssessment', ClientAssessmentSchema);
