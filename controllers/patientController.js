const Patient = require('../models/Patient');
const User = require('../models/User');
const Session = require('../models/Session'); // Assuming model path
const DailyProgressReport = require('../models/DailyProgressReport');
const GroupProgressReport = require('../models/GroupProgressReport');

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private/Admin/Counselor
exports.createPatient = async (req, res) => {
    const { email, profilePicture, clientPersonalInformation, parentGuardianInformation, acutePhase, rehabilitativePhase } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required to create a user account for the patient.' });
    }

    try {
        // Check if a user with this email already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        // Generate a random 8-digit password
        const generatedPassword = Math.floor(10000000 + Math.random() * 90000000).toString();

        // Create a new user for the patient
        const user = new User({
            email,
            role: 'Patient',
        });
        user.setPassword(generatedPassword);
        const savedUser = await user.save();

        // Create the patient profile
        const patient = new Patient({
            userId: savedUser._id,
            profilePicture, // Assuming base64 string
            clientPersonalInformation,
            parentGuardianInformation,
            acutePhase,
            rehabilitativePhase
        });

        const savedPatient = await patient.save();
        
        // TODO: In a real-world scenario, you'd email the generated password to the user.
        // For now, we can return it in the response for testing purposes.
        res.status(201).json({ 
            patient: savedPatient, 
            generatedPassword: generatedPassword // IMPORTANT: For development only. Remove in production.
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private/Admin/Counselor
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find({}).populate('userId', 'email isActive');
        res.status(200).json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single patient by ID
// @route   GET /api/patients/:id
// @access  Private/Admin/Counselor
exports.getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id).populate('userId', 'email isActive');
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a patient
// @route   PUT /api/patients/:id
// @access  Private/Admin/Counselor
exports.updatePatient = async (req, res) => {
    try {
        const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a patient
// @route   DELETE /api/patients/:id
// @access  Private/Admin/Counselor
exports.deletePatient = async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Also delete the associated user account
        await User.findByIdAndDelete(patient.userId);
        await patient.remove();

        res.status(200).json({ message: 'Patient and associated user account removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get count of active patients
// @route   GET /api/patients/stats/active-count
// @access  Private/Admin/Counselor
exports.getActivePatientCount = async (req, res) => {
    try {
        const count = await Patient.countDocuments({ status: 'Active' });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get count of new enrollments for a given period
// @route   GET /api/patients/stats/new-enrollments
// @access  Private/Admin/Counselor
exports.getNewEnrollments = async (req, res) => {
    try {
        const { period } = req.query;
        let startDate = new Date();
        if (period === 'month') {
            startDate.setMonth(startDate.getMonth() - 1);
        } else if (period === 'week') {
            startDate.setDate(startDate.getDate() - 7);
        } else {
            startDate = new Date(0); // All time
        }

        const count = await Patient.countDocuments({ createdAt: { $gte: startDate } });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get count of sessions for a given period
// @route   GET /api/patients/stats/sessions-count
// @access  Private/Admin/Counselor
exports.getSessionsCount = async (req, res) => {
    const { period } = req.query;
    let startDate;

    switch (period) {
        case 'week':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'month':
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        default:
            startDate = new Date(0);
            break;
    }

    try {
        const count = await Session.countDocuments({ date: { $gte: startDate } });
        res.status(200).json({ count, change: 0 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get count of progress reports due
// @route   GET /api/patients/stats/reports-due
// @access  Private/Admin/Counselor
exports.getProgressReportsDue = async (req, res) => {
    try {
        const query = { status: { $in: ['Pending', 'Overdue'] } };

        const dailyReportsCount = await DailyProgressReport.countDocuments(query);
        const groupReportsCount = await GroupProgressReport.countDocuments(query);
        
        res.status(200).json({ count: dailyReportsCount + groupReportsCount });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
