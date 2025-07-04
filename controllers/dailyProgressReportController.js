const DailyProgressReport = require('../models/DailyProgressReport');

// @desc    Get all daily progress reports
// @route   GET /api/daily-progress-reports
// @access  Private/Authorized Staff
exports.getAllDailyProgressReports = async (req, res) => {
    try {
        const reports = await DailyProgressReport.find({})
            .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
            .populate('counselorId', 'staffInfo.fullName');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all reports for a specific patient
// @route   GET /api/daily-progress-reports/patient/:patientId
// @access  Private/Authorized Staff
exports.getReportsForPatient = async (req, res) => {
    try {
        const reports = await DailyProgressReport.find({ patientId: req.params.patientId })
            .populate('counselorId', 'staffInfo.fullName')
            .sort({ date: -1 });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single daily progress report by ID
// @route   GET /api/daily-progress-reports/:id
// @access  Private/Authorized Staff
exports.getDailyProgressReportById = async (req, res) => {
    try {
        const report = await DailyProgressReport.findById(req.params.id)
            .populate('patientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
            .populate('counselorId', 'staffInfo.fullName');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new daily progress report
// @route   POST /api/daily-progress-reports
// @access  Private/Authorized Staff
exports.createDailyProgressReport = async (req, res) => {
    const { patientId, date, status, summary, plan } = req.body;
    try {
        const newReport = new DailyProgressReport({
            patientId,
            counselorId: req.user._id,
            date,
            status,
            summary,
            plan
        });
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a daily progress report
// @route   PUT /api/daily-progress-reports/:id
// @access  Private/Authorized Staff
exports.updateDailyProgressReport = async (req, res) => {
    try {
        const updatedReport = await DailyProgressReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a daily progress report
// @route   DELETE /api/daily-progress-reports/:id
// @access  Private/Authorized Staff
exports.deleteDailyProgressReport = async (req, res) => {
    try {
        const report = await DailyProgressReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        await report.remove();
        res.status(200).json({ message: 'Daily progress report removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
