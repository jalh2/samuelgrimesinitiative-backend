const User = require('../models/User');

// @desc    Get current user's profile
// @route   GET /api/users/me
// @access  Private
exports.getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Get all instructors (staff who can teach courses)
// @route   GET /api/users/instructors
// @access  Private/Admin/Director
exports.getInstructors = async (req, res) => {
    try {
        // Find users who are staff (teachers, counselors, etc.)
        const instructors = await User.find({
            role: { $in: ['staff', 'nurse', 'mental health counselor', 'executive director'] }
        }).populate('staffInfo');
        
        res.status(200).json(instructors);
    } catch (error) {
        console.error('Error fetching instructors:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
    let filter = {};
    if (req.query.role) {
        // Handles both a single role string and an array of roles from query params
        const roles = Array.isArray(req.query.role) ? req.query.role : req.query.role.split(',');
        filter.role = { $in: roles };
    }

    try {
        const users = await User.find(filter).populate('staffInfo'); // Populate staffInfo for details
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get single user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Create a new user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
    // This check is redundant if the authorize middleware is used correctly, but provides extra security.
    if (req.user.role !== 'admin' && req.user.role !== 'executive director') {
        return res.status(403).json({ success: false, message: 'You do not have permission to perform this action.' });
    }

    const { email, password, role, staffInfo, course } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Build user data conditionally
        const userData = {
            email,
            role,
        };

        // Include staffInfo only if the role requires it
        if (['staff', 'nurse', 'mental health counselor', 'financial controller', 'executive director'].includes(role)) {
            if (!staffInfo) {
                return res.status(400).json({ success: false, message: 'Staff information is required for this role.' });
            }
            userData.staffInfo = staffInfo;
        }

        // If the role is student, course is required
        if (role === 'student') {
            if (!course) {
                return res.status(400).json({ success: false, message: 'Course is required for students.' });
            }
            userData.course = course;
        }

        const user = new User(userData);

        // setPassword is a custom method on our model
        user.setPassword(password);

        const createdUser = await user.save();

        // Don't send back the hash and salt
        const userResponse = createdUser.toObject();
        delete userResponse.hash;
        delete userResponse.salt;

        res.status(201).json({ success: true, data: userResponse });

    } catch (error) {
        console.error('Error creating user:', error);
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Update a user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
    console.log('--- Update User Request Received ---');
    console.log('Request Body:', req.body);
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { email, role, staffInfo, course } = req.body;

        // Update basic fields
        if (email) user.email = email;
        if (role) user.role = role;

        // Determine the role to be used for logic
        const newRole = role || user.role;

        // Handle role-specific fields
        if (newRole === 'student') {
            if (course) {
                user.course = course;
            } else if (role === 'student') {
                return res.status(400).json({ message: 'Course is required for students.' });
            }
            user.staffInfo = undefined;
        } else if (['staff', 'nurse', 'mental health counselor', 'financial controller', 'executive director'].includes(newRole)) {
            if (staffInfo) {
                user.staffInfo = { ...user.staffInfo, ...staffInfo };
            } else if (role) {
                return res.status(400).json({ message: 'Staff information is required for this role.' });
            }
            user.course = undefined;
        } else {
            user.course = undefined;
            user.staffInfo = undefined;
        }

        console.log('User object before saving:', user);
        const savedUser = await user.save();
        const updatedUser = await User.findById(savedUser._id).populate('course').populate('staffInfo');
        console.log('Final populated user sent to frontend:', updatedUser);
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.status(200).json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Test admin-only access
// @route   GET /api/users/admin-test
// @access  Private/Admin
exports.adminTest = (req, res) => {
    res.status(200).json({ success: true, message: 'Admin access granted' });
};
