const FinalEvaluation = require('../models/FinalEvaluation');
const Patient = require('../models/Patient');

// @desc    Get all final evaluations
// @route   GET /api/final-evaluations
// @access  Private (admin, counselor, nurse)
exports.getAllFinalEvaluations = async (req, res) => {
  try {
    const items = await FinalEvaluation.find({})
      .sort({ createdAt: -1 })
      .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
      .populate('submittedBy', 'staffInfo.fullName email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get final evaluations for the logged-in patient
// @route   GET /api/final-evaluations/me
// @access  Private (patient, admin, counselor, nurse)
exports.getMyFinalEvaluations = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authorized: missing user context' });
    const patient = await Patient.findOne({ userId });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    const items = await FinalEvaluation.find({ patientId: patient._id }).sort({ date: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get final evaluations for a specific patient
// @route   GET /api/final-evaluations/patient/:patientId
// @access  Private (admin, counselor, nurse)
exports.getFinalEvaluationsForPatient = async (req, res) => {
  try {
    const items = await FinalEvaluation.find({ patientId: req.params.patientId }).sort({ date: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single final evaluation by ID
// @route   GET /api/final-evaluations/:id
// @access  Private (admin, counselor, nurse)
exports.getFinalEvaluationById = async (req, res) => {
  try {
    const item = await FinalEvaluation.findById(req.params.id)
      .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
      .populate('submittedBy', 'staffInfo.fullName email');
    if (!item) return res.status(404).json({ message: 'Final evaluation not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a final evaluation
// @route   POST /api/final-evaluations
// @access  Private (admin, counselor, nurse, patient)
exports.createFinalEvaluation = async (req, res) => {
  try {
    let { patientId, clientName, date, journeyReflection, lessons, copingStrategies, supportNetwork, nextSixMonthsGoals, facilitatorComments, nextSteps, facilitatorSignature, signatureDate } = req.body;

    // If requester is a patient and patientId not provided, derive from user
    if (!patientId && req.user) {
      const patient = await Patient.findOne({ userId: req.user.id });
      if (patient) patientId = patient._id;
    }

    if (!patientId) {
      return res.status(400).json({ message: 'patientId is required' });
    }

    const newItem = new FinalEvaluation({
      patientId,
      submittedBy: req.user.id,
      clientName,
      date: date || Date.now(),
      journeyReflection,
      lessons,
      copingStrategies,
      supportNetwork,
      nextSixMonthsGoals,
      facilitatorComments,
      nextSteps,
      facilitatorSignature,
      signatureDate,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a final evaluation
// @route   PUT /api/final-evaluations/:id
// @access  Private (admin, counselor, nurse)
exports.updateFinalEvaluation = async (req, res) => {
  try {
    const updated = await FinalEvaluation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Final evaluation not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a final evaluation
// @route   DELETE /api/final-evaluations/:id
// @access  Private (admin)
exports.deleteFinalEvaluation = async (req, res) => {
  try {
    const item = await FinalEvaluation.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Final evaluation not found' });
    await item.remove();
    res.status(200).json({ message: 'Final evaluation removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
