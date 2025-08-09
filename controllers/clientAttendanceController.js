const ClientAttendanceReport = require('../models/ClientAttendanceReport');
const Patient = require('../models/Patient');

// @desc    Get client attendance reports (with optional filters year, month, weekNumber)
// @route   GET /api/client-attendance
// @access  Private/Authorized Staff
exports.getAllClientAttendanceReports = async (req, res) => {
    try {
        const { year, month, weekNumber } = req.query;
        const filter = {};

        if (month) filter.month = month;
        if (weekNumber) filter.weekNumber = Number(weekNumber);
        if (year) {
            const y = Number(year);
            const start = new Date(y, 0, 1);
            const end = new Date(y + 1, 0, 1);
            filter.date = { $gte: start, $lt: end };
        }

        const reports = await ClientAttendanceReport.find(filter)
            .sort({ date: -1 })
            .populate('clients.clientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName clientPersonalInformation.gender');

        return res.status(200).json({ success: true, data: reports });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get attendance reports for the logged-in patient (filters optional)
// @route   GET /api/client-attendance/me
// @access  Private/Patient (and staff/admin allowed)
exports.getMyClientAttendance = async (req, res) => {
    try {
        const userId = req?.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Not authorized: missing user context' });
        }
        const patient = await Patient.findOne({ userId });
        if (!patient) {
            return res.status(404).json({ success: false, message: 'Patient profile not found' });
        }

        const { year, month, weekNumber } = req.query;
        const filter = {};
        if (month) filter.month = month;
        if (weekNumber) filter.weekNumber = Number(weekNumber);
        if (year) {
            const y = Number(year);
            const start = new Date(y, 0, 1);
            const end = new Date(y + 1, 0, 1);
            filter.date = { $gte: start, $lt: end };
        }

        const reports = await ClientAttendanceReport.find(filter)
            .sort({ date: -1 })
            .populate('clients.clientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName clientPersonalInformation.gender');

        // Reduce clients array to only the logged-in patient's entry
        const pruned = reports
            .map(r => {
                const match = (r.clients || []).find(c => String(c.clientId) === String(patient._id));
                if (!match) return null;
                const obj = r.toObject();
                obj.clients = [match];
                return obj;
            })
            .filter(Boolean);

        return res.status(200).json({ success: true, data: pruned });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Get a single client attendance report by ID
// @route   GET /api/client-attendance/:id
// @access  Private/Authorized Staff
exports.getClientAttendanceReportById = async (req, res) => {
    try {
        const report = await ClientAttendanceReport.findById(req.params.id)
            .populate('clients.clientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName clientPersonalInformation.gender');

        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        return res.status(200).json({ success: true, data: report });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Create a new client attendance report
// @route   POST /api/client-attendance
// @access  Private/Authorized Staff
exports.createClientAttendanceReport = async (req, res) => {
    try {
        const body = req.body || {};
        const clients = Array.isArray(body.clients) ? body.clients : [];

        // Derive totals if not provided
        const totalPerson = body.totalPerson ?? clients.length;
        let male = body.genderCount?.male ?? 0;
        let female = body.genderCount?.female ?? 0;
        if (male === 0 && female === 0 && clients.length) {
            // Attempt to count from provided client.gender if present
            for (const c of clients) {
                const g = (c.gender || c?.clientId?.clientPersonalInformation?.gender || '').toString().toLowerCase();
                if (g === 'male') male++;
                else if (g === 'female') female++;
            }
        }

        const payload = {
            month: body.month,
            weekNumber: body.weekNumber,
            roomName: body.roomName,
            date: body.date,
            totalPerson,
            genderCount: { male, female },
            clients,
            note: body.note,
            securityOnShift: body.securityOnShift,
            verifiedByNextShift: body.verifiedByNextShift,
            attestedBy: body.attestedBy,
        };

        const savedReport = await ClientAttendanceReport.create(payload);
        return res.status(201).json({ success: true, data: savedReport });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Update a client attendance report
// @route   PUT /api/client-attendance/:id
// @access  Private/Authorized Staff
exports.updateClientAttendanceReport = async (req, res) => {
    try {
        const updatedReport = await ClientAttendanceReport.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('clients.clientId', 'clientPersonalInformation.firstName clientPersonalInformation.lastName clientPersonalInformation.gender');

        if (!updatedReport) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        return res.status(200).json({ success: true, data: updatedReport });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// @desc    Delete a client attendance report
// @route   DELETE /api/client-attendance/:id
// @access  Private/Authorized Staff
exports.deleteClientAttendanceReport = async (req, res) => {
    try {
        const report = await ClientAttendanceReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ success: false, message: 'Report not found' });
        }
        await report.deleteOne();
        return res.status(200).json({ success: true, message: 'Client attendance report removed' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
