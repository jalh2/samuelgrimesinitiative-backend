const mongoose = require('mongoose');

const clinicalRatingsSchema = new mongoose.Schema({
  cravingControl: { type: Number, min: 1, max: 10, required: true },
  cravingControlNotes: { type: String },
  moodStability: { type: Number, min: 1, max: 10, required: true },
  moodStabilityNotes: { type: String },
  sleepQuality: { type: Number, min: 1, max: 10, required: true },
  sleepQualityNotes: { type: String },
  supportSystem: { type: Number, min: 1, max: 10, required: true },
  supportSystemNotes: { type: String },
  sobrietyMaintained: { type: Number, min: 1, max: 10, required: true },
  sobrietyMaintainedNotes: { type: String },
  vocationalSkill: { type: Number, min: 1, max: 10, required: true },
  vocationalSkillNotes: { type: String },
}, { _id: false });

const counselorChecklistSchema = new mongoose.Schema({
  attendedSessions: { type: Boolean, default: false },
  progressOnGoals: { type: Boolean, default: false },
  noNewSubstanceUse: { type: Boolean, default: false },
  usedCopingSkills: { type: Boolean, default: false },
  engagedInDiscussion: { type: Boolean, default: false },
}, { _id: false });

const progressTrackerSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  clientName: { type: String },
  weekNumber: { type: String },
  date: { type: Date, default: Date.now },
  programType: { type: String, enum: ['IOP', 'IP', 'OP', 'Other'], required: true },
  clinicalRatings: { type: clinicalRatingsSchema, required: true },
  counselorObservation: { type: counselorChecklistSchema, default: () => ({}) },
  strengthsDemonstrated: { type: String },
  followUpActions: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ProgressTracker', progressTrackerSchema);
