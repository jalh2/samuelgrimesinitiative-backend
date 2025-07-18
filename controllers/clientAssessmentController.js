const ClientAssessment = require('../models/ClientAssessment');

// @desc    Get all client assessments
// @route   GET /api/client-assessments
// @access  Private
exports.getAllAssessments = async (req, res) => {
    try {
                const assessments = await ClientAssessment.find().populate('client', 'patientId clientPersonalInformation');
        res.status(200).json(assessments);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single client assessment by ID
// @route   GET /api/client-assessments/:id
// @access  Private
exports.getAssessmentById = async (req, res) => {
    try {
        const assessment = await ClientAssessment.findById(req.params.id).populate('client', 'name');
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.status(200).json(assessment);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new client assessment
// @route   POST /api/client-assessments
// @access  Private
exports.createAssessment = async (req, res) => {
    try {
        const newAssessment = new ClientAssessment(req.body);
        const savedAssessment = await newAssessment.save();
        res.status(201).json(savedAssessment);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create assessment', error: error.message });
    }
};

// @desc    Update a client assessment
// @route   PUT /api/client-assessments/:id
// @access  Private
exports.updateAssessment = async (req, res) => {
    try {
        const updatedAssessment = await ClientAssessment.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedAssessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        res.status(200).json(updatedAssessment);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update assessment', error: error.message });
    }
};

// @desc    Delete a client assessment
// @route   DELETE /api/client-assessments/:id
// @access  Private
exports.deleteAssessment = async (req, res) => {
    try {
        const assessment = await ClientAssessment.findById(req.params.id);
        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }
        await assessment.remove();
        res.status(200).json({ message: 'Assessment removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
