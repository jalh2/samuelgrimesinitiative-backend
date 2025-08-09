const GroupProgressReport = require('../models/GroupProgressReport');

// @desc    Get all group progress reports
// @route   GET /api/group-progress-reports
// @access  Private/Authorized Staff
exports.getAllGroupProgressReports = async (req, res) => {
    try {
        const { q } = req.query;
        const filter = {};

        if (q && typeof q === 'string' && q.trim()) {
            const regex = new RegExp(q.trim(), 'i');
            filter.$or = [
                { groupName: regex },
                { topic: regex },
                { objective: regex },
                { process: regex },
                { materialsUsed: regex },
                { groupDynamics: regex },
                { evaluation: regex },
                { recommendation: regex },
            ];
        }

        const reports = await GroupProgressReport.find(filter)
            .sort({ createdAt: -1 })
            .populate('participants', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
            .populate('facilitator', 'staffInfo.fullName email');
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
            .populate('participants', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
            .populate('facilitator', 'staffInfo.fullName email');
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
    const { groupName, date, topic, process, groupDynamics, evaluation, recommendation, participants = [] } = req.body;
    try {
        if (!groupName || !date) {
            return res.status(400).json({ message: 'groupName and date are required' });
        }
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Not authorized: user context missing' });
        }
        const newReport = new GroupProgressReport({
            groupName,
            date,
            facilitator: req.user.id,
            topic,
            process,
            groupDynamics,
            evaluation,
            recommendation,
            participants
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
