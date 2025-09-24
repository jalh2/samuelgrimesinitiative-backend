const ProgressTracker = require('../models/ProgressTracker');

// @desc    Get all progress trackers
// @route   GET /api/progress-trackers
// @access  Private (admin, counselor, nurse)
exports.getAllProgressTrackers = async (req, res) => {
  try {
    const items = await ProgressTracker.find({})
      .sort({ createdAt: -1 })
      .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
      .populate('staffId', 'staffInfo.fullName email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get progress trackers for a specific patient
// @route   GET /api/progress-trackers/patient/:patientId
// @access  Private (admin, counselor, nurse)
exports.getProgressTrackersForPatient = async (req, res) => {
  try {
    const items = await ProgressTracker.find({ patientId: req.params.patientId })
      .sort({ date: -1 })
      .populate('staffId', 'staffInfo.fullName email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single progress tracker by ID
// @route   GET /api/progress-trackers/:id
// @access  Private (admin, counselor, nurse)
exports.getProgressTrackerById = async (req, res) => {
  try {
    const item = await ProgressTracker.findById(req.params.id)
      .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
      .populate('staffId', 'staffInfo.fullName email');
    if (!item) return res.status(404).json({ message: 'Progress tracker not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a progress tracker entry
// @route   POST /api/progress-trackers
// @access  Private (admin, counselor, nurse)
exports.createProgressTracker = async (req, res) => {
  try {
    const { patientId, clientName, weekNumber, date, programType, clinicalRatings, counselorObservation, strengthsDemonstrated, followUpActions } = req.body;
    if (!patientId || !programType || !clinicalRatings) {
      return res.status(400).json({ message: 'patientId, programType and clinicalRatings are required' });
    }
    const newItem = new ProgressTracker({
      patientId,
      staffId: req.user.id,
      clientName,
      weekNumber,
      date: date || Date.now(),
      programType,
      clinicalRatings,
      counselorObservation,
      strengthsDemonstrated,
      followUpActions,
    });
    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a progress tracker entry
// @route   PUT /api/progress-trackers/:id
// @access  Private (admin, counselor, nurse)
exports.updateProgressTracker = async (req, res) => {
  try {
    const updated = await ProgressTracker.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Progress tracker not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a progress tracker entry
// @route   DELETE /api/progress-trackers/:id
// @access  Private (admin)
exports.deleteProgressTracker = async (req, res) => {
  try {
    const item = await ProgressTracker.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Progress tracker not found' });
    await item.remove();
    res.status(200).json({ message: 'Progress tracker removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
