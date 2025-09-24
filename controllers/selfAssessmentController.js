const SelfAssessment = require('../models/SelfAssessment');
const Patient = require('../models/Patient');

// @desc    Get all self assessments
// @route   GET /api/self-assessments
// @access  Private (admin, counselor, nurse)
exports.getAllSelfAssessments = async (req, res) => {
  try {
    const items = await SelfAssessment.find({})
      .sort({ createdAt: -1 })
      .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
      .populate('submittedBy', 'staffInfo.fullName email');
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get self assessments for the logged-in patient
// @route   GET /api/self-assessments/me
// @access  Private (patient, admin, counselor, nurse)
exports.getMySelfAssessments = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authorized: missing user context' });
    const patient = await Patient.findOne({ userId });
    if (!patient) return res.status(404).json({ message: 'Patient profile not found' });

    const items = await SelfAssessment.find({ patientId: patient._id }).sort({ date: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get self assessments for a specific patient
// @route   GET /api/self-assessments/patient/:patientId
// @access  Private (admin, counselor, nurse)
exports.getAssessmentsForPatient = async (req, res) => {
  try {
    const items = await SelfAssessment.find({ patientId: req.params.patientId }).sort({ date: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get a single self assessment by ID
// @route   GET /api/self-assessments/:id
// @access  Private (admin, counselor, nurse, patient (if owns))
exports.getSelfAssessmentById = async (req, res) => {
  try {
    const item = await SelfAssessment.findById(req.params.id)
      .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
      .populate('submittedBy', 'staffInfo.fullName email');
    if (!item) return res.status(404).json({ message: 'Self assessment not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a self assessment
// @route   POST /api/self-assessments
// @access  Private (admin, counselor, nurse, patient)
exports.createSelfAssessment = async (req, res) => {
  try {
    let { patientId, name, date, ratings, reflections } = req.body;

    // If the requester is a patient and patientId is not provided, derive from user
    if (!patientId && req.user) {
      const patient = await Patient.findOne({ userId: req.user.id });
      if (patient) patientId = patient._id;
    }

    if (!patientId || !ratings) {
      return res.status(400).json({ message: 'patientId and ratings are required' });
    }

    const newItem = new SelfAssessment({
      patientId,
      submittedBy: req.user.id,
      name,
      date: date || Date.now(),
      ratings,
      reflections,
    });

    const saved = await newItem.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a self assessment
// @route   PUT /api/self-assessments/:id
// @access  Private (admin, counselor, nurse)
exports.updateSelfAssessment = async (req, res) => {
  try {
    const updated = await SelfAssessment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Self assessment not found' });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a self assessment
// @route   DELETE /api/self-assessments/:id
// @access  Private (admin)
exports.deleteSelfAssessment = async (req, res) => {
  try {
    const item = await SelfAssessment.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Self assessment not found' });
    await item.remove();
    res.status(200).json({ message: 'Self assessment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
