const ClientAttendanceReport = require('../models/ClientAttendanceReport');

// @desc    Get all client attendance reports
// @route   GET /api/client-attendance
// @access  Private/Authorized Staff
exports.getAllClientAttendanceReports = async (req, res) => {
    try {
        const reports = await ClientAttendanceReport.find({})
            .populate('clientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
            .populate('signatures.preparedBy', 'staffInfo.fullName')
            .populate('signatures.approvedBy', 'staffInfo.fullName');
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single client attendance report by ID
// @route   GET /api/client-attendance/:id
// @access  Private/Authorized Staff
exports.getClientAttendanceReportById = async (req, res) => {
    try {
        const report = await ClientAttendanceReport.findById(req.params.id)
            .populate('clientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName')
            .populate('signatures.preparedBy', 'staffInfo.fullName')
            .populate('signatures.approvedBy', 'staffInfo.fullName');

        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new client attendance report
// @route   POST /api/client-attendance
// @access  Private/Authorized Staff
exports.createClientAttendanceReport = async (req, res) => {
    const { clientId, weekOf, attendance, signatures } = req.body;

    try {
        const newReport = new ClientAttendanceReport({
            clientId,
            weekOf,
            attendance,
            signatures: {
                ...signatures,
                preparedBy: req.user._id // Automatically set the preparer to the logged-in user
            }
        });

        const savedReport = await newReport.save();
        res.status(201).json(savedReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a client attendance report
// @route   PUT /api/client-attendance/:id
// @access  Private/Authorized Staff
exports.updateClientAttendanceReport = async (req, res) => {
    try {
        const updatedReport = await ClientAttendanceReport.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedReport) {
            return res.status(404).json({ message: 'Report not found' });
        }
        res.status(200).json(updatedReport);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a client attendance report
// @route   DELETE /api/client-attendance/:id
// @access  Private/Authorized Staff
exports.deleteClientAttendanceReport = async (req, res) => {
    try {
        const report = await ClientAttendanceReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found' });
        }
        await report.remove();
        res.status(200).json({ message: 'Client attendance report removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
