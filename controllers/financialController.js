const FinancialReport = require('../models/FinancialReport');

// @desc    Get all financial reports with filtering
// @route   GET /api/financials
// @access  Private/Financial
exports.getAllReports = async (req, res) => {
    const { reportType, startDate, endDate } = req.query;
    const query = {};

    if (reportType) {
        query.reportType = reportType;
    }

    if (startDate && endDate) {
        query.period = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    try {
        const reports = await FinancialReport.find(query).populate('createdBy', 'staffInfo.fullName');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single financial report by ID
// @route   GET /api/financials/:id
// @access  Private/Financial
exports.getReportById = async (req, res) => {
    try {
        const report = await FinancialReport.findById(req.params.id).populate('createdBy', 'staffInfo.fullName');
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new financial report
// @route   POST /api/financials
// @access  Private/Financial
exports.createReport = async (req, res) => {
    const { title, reportType, period, summary, data } = req.body;
    try {
        const newReport = new FinancialReport({
            title,
            reportType,
            period,
            summary,
            data,
            createdBy: req.user._id
        });
        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a financial report
// @route   PUT /api/financials/:id
// @access  Private/Financial
exports.updateReport = async (req, res) => {
    try {
        const updatedReport = await FinancialReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a financial report
// @route   DELETE /api/financials/:id
// @access  Private/Financial
exports.deleteReport = async (req, res) => {
    try {
        const report = await FinancialReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        await report.remove();
        res.status(200).json({ message: 'Report removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
