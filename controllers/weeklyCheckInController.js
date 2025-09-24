const WeeklyCheckIn = require('../models/WeeklyCheckIn');

// @desc    Get all weekly check-ins
// @route   GET /api/weekly-check-ins
// @access  Private (admin, counselor, nurse)
exports.getAllWeeklyCheckIns = async (req, res) => {
  try {
    const checkIns = await WeeklyCheckIn.find({})
      .sort({ createdAt: -1 })
      .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
      .populate('staffId', 'staffInfo.fullName email');
    res.status(200).json(checkIns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get weekly check-ins for a specific patient
// @route   GET /api/weekly-check-ins/patient/:patientId
// @access  Private (admin, counselor, nurse)
exports.getCheckInsForPatient = async (req, res) => {
  try {
    const checkIns = await WeeklyCheckIn.find({ patientId: req.params.patientId })
      .sort({ date: -1 })
      .populate('staffId', 'staffInfo.fullName email');
    res.status(200).json(checkIns);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single weekly check-in by ID
// @route   GET /api/weekly-check-ins/:id
// @access  Private (admin, counselor, nurse)
exports.getWeeklyCheckInById = async (req, res) => {
  try {
    const item = await WeeklyCheckIn.findById(req.params.id)
      .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
      .populate('staffId', 'staffInfo.fullName email');
    if (!item) return res.status(404).json({ message: 'Weekly check-in not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a weekly check-in
// @route   POST /api/weekly-check-ins
// @access  Private (admin, counselor, nurse)
exports.createWeeklyCheckIn = async (req, res) => {
  try {
    const { patientId, name, weekNumber, challenge, success, mood, goalNextWeek, date } = req.body;
    if (!patientId || !mood) {
      return res.status(400).json({ message: 'patientId and mood are required' });
    }
    const newItem = new WeeklyCheckIn({
      patientId,
      staffId: req.user.id,
      name,
      weekNumber,
      challenge,
      success,
      mood,
      goalNextWeek,
      date: date || Date.now(),
    });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a weekly check-in
// @route   PUT /api/weekly-check-ins/:id
// @access  Private (admin, counselor, nurse)
exports.updateWeeklyCheckIn = async (req, res) => {
  try {
    const updated = await WeeklyCheckIn.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Weekly check-in not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a weekly check-in
// @route   DELETE /api/weekly-check-ins/:id
// @access  Private (admin)
exports.deleteWeeklyCheckIn = async (req, res) => {
  try {
    const item = await WeeklyCheckIn.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Weekly check-in not found' });
    await item.remove();
    res.status(200).json({ message: 'Weekly check-in removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
