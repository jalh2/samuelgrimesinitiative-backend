const mongoose = require('mongoose');

const finalEvaluationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String },
  date: { type: Date, default: Date.now },
  journeyReflection: { type: String },
  lessons: {
    lesson1: { type: String },
    lesson2: { type: String },
    lesson3: { type: String },
  },
  copingStrategies: { type: String },
  supportNetwork: { type: String },
  nextSixMonthsGoals: { type: String },
  facilitatorComments: { type: String },
  nextSteps: { type: String }, // Aftercare / Referrals
  facilitatorSignature: { type: String }, // or data URL / path
  signatureDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('FinalEvaluation', finalEvaluationSchema);
