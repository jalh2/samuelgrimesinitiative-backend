const mongoose = require('mongoose');

const weeklyCheckInSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String },
  weekNumber: { type: String },
  challenge: { type: String },
  success: { type: String },
  mood: {
    type: String,
    enum: ['Happy', 'Neutral', 'Sad', 'Angry', 'Anxious', 'Other'],
    required: true,
  },
  goalNextWeek: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('WeeklyCheckIn', weeklyCheckInSchema);
