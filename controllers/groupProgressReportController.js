const GroupProgressReport = require('../models/GroupProgressReport');

// @desc    Get all group progress reports
// @route   GET /api/group-progress-reports
// @access  Private/Authorized Staff
exports.getAllGroupProgressReports = async (req, res) => {
    try {
        const reports = await GroupProgressReport.find({})
            .populate('patientIds', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
            .populate('counselorId', 'staffInfo.fullName');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single group progress report by ID
// @route   GET /api/group-progress-reports/:id
// @access  Private/Authorized Staff
exports.getGroupProgressReportById = async (req, res) => {
    try {
        const report = await GroupProgressReport.findById(req.params.id)
            .populate('patientIds', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
            .populate('counselorId', 'staffInfo.fullName');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new group progress report
// @route   POST /api/group-progress-reports
// @access  Private/Authorized Staff
exports.createGroupProgressReport = async (req, res) => {
    const { groupName, date, patientIds, topicsCovered, groupProcess, summary, plan } = req.body;
    try {
        const newReport = new GroupProgressReport({
            groupName,
            date,
            counselorId: req.user._id,
            patientIds,
            topicsCovered,
            groupProcess,
            summary,
            plan
        });
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a group progress report
// @route   PUT /api/group-progress-reports/:id
// @access  Private/Authorized Staff
exports.updateGroupProgressReport = async (req, res) => {
    try {
        const updatedReport = await GroupProgressReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a group progress report
// @route   DELETE /api/group-progress-reports/:id
// @access  Private/Authorized Staff
exports.deleteGroupProgressReport = async (req, res) => {
    try {
        const report = await GroupProgressReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        await report.remove();
        res.status(200).json({ message: 'Group progress report removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
