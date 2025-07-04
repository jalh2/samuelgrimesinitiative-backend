const User = require('../models/User');
const Student = require('../models/Student');
const Patient = require('../models/Patient');
const Course = require('../models/Course');
const LibraryMaterial = require('../models/LibraryMaterial');
const Donation = require('../models/Donation');
const PaymentRequest = require('../models/PaymentRequest');
const StaffAttendance = require('../models/StaffAttendance');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const [ 
            totalUsers,
            totalStudents,
            totalPatients,
            totalStaff,
            totalCourses,
            totalLibraryMaterials,
            totalDonations,
            totalPaymentRequests,
            todaysAttendance
        ] = await Promise.all([
            User.countDocuments(),
            Student.countDocuments(),
            Patient.countDocuments(),
            User.countDocuments({ role: { $in: ['Staff', 'Admin', 'Executive Director', 'Financial Controller', 'Mental Health Counselor'] } }),
            Course.countDocuments(),
            LibraryMaterial.countDocuments(),
            Donation.countDocuments(),
            PaymentRequest.countDocuments(),
            StaffAttendance.find({ date: { $gte: today, $lt: tomorrow } }).populate('staffId', 'staffInfo.fullName')
        ]);

        res.status(200).json({
            totalUsers,
            totalStudents,
            totalPatients,
            totalStaff,
            totalCourses,
            totalLibraryMaterials,
            totalDonations,
            totalPaymentRequests,
            todaysAttendance
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
