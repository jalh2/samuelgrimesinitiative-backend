const StaffAttendance = require('../models/StaffAttendance');

// @desc    Staff check-in
// @route   POST /api/attendance/staff/check-in
// @access  Private/Staff
exports.staffCheckIn = async (req, res) => {
    const staffId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        // Check if already checked in today
        const existingAttendance = await StaffAttendance.findOne({ staffId, date: { $gte: today } });
        if (existingAttendance) {
            return res.status(400).json({ message: 'You have already checked in today.' });
        }

        const checkInTime = new Date();
        let status = 'On-Time';

        // Check for late arrival (after 9 AM)
        const nineAM = new Date(today.getTime());
        nineAM.setHours(9, 0, 0, 0);
        if (checkInTime > nineAM) {
            status = 'Late';
        }

        const newAttendance = new StaffAttendance({
            staffId,
            checkIn: checkInTime,
            status
        });

        await newAttendance.save();
        res.status(201).json(newAttendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Staff check-out
// @route   POST /api/attendance/staff/check-out
// @access  Private/Staff
exports.staffCheckOut = async (req, res) => {
    const staffId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
        const attendance = await StaffAttendance.findOne({ staffId, date: { $gte: today } });

        if (!attendance) {
            return res.status(404).json({ message: 'No check-in record found for today.' });
        }

        if (attendance.checkOut) {
            return res.status(400).json({ message: 'You have already checked out today.' });
        }

        attendance.checkOut = new Date();

        // Check for early departure (before 3 PM)
        const threePM = new Date(today.getTime());
        threePM.setHours(15, 0, 0, 0);
        if (attendance.checkOut < threePM && attendance.status !== 'Late') {
            attendance.status = 'Early-Out';
        }

        await attendance.save();
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all staff attendance
// @route   GET /api/attendance/staff
// @access  Private/Admin
exports.getStaffAttendance = async (req, res) => {
    const { date } = req.query;
    const query = {};

    if (date) {
        const searchDate = new Date(date);
        searchDate.setHours(0, 0, 0, 0);
        const nextDay = new Date(searchDate);
        nextDay.setDate(searchDate.getDate() + 1);
        query.date = { $gte: searchDate, $lt: nextDay };
    }

    try {
        const attendanceRecords = await StaffAttendance.find(query).populate('staffId', 'staffInfo.fullName');
        res.status(200).json(attendanceRecords);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get my attendance records
// @route   GET /api/attendance/staff/me
// @access  Private/Staff
exports.getMyAttendance = async (req, res) => {
    try {
        const myAttendance = await StaffAttendance.find({ staffId: req.user._id }).sort({ date: -1 });
        res.status(200).json(myAttendance);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
