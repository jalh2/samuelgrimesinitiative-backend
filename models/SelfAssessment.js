const mongoose = require('mongoose');

const ratingsSchema = new mongoose.Schema({
  motivationToStayClean: { type: Number, min: 1, max: 5, required: true },
  abilityToManageCravings: { type: Number, min: 1, max: 5, required: true },
  abilityToHandleStress: { type: Number, min: 1, max: 5, required: true },
  selfConfidence: { type: Number, min: 1, max: 5, required: true },
  relationshipsWithOthers: { type: Number, min: 1, max: 5, required: true },
}, { _id: false });

const reflectionSchema = new mongoose.Schema({
  mostProudOf: { type: String },
  wantToImprove: { type: String },
  supportNeeded: { type: String },
}, { _id: false });

const selfAssessmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
  date: { type: Date, default: Date.now },
  ratings: { type: ratingsSchema, required: true },
  reflections: { type: reflectionSchema },
}, { timestamps: true });

module.exports = mongoose.model('SelfAssessment', selfAssessmentSchema);
