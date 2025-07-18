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
            role: { $in: ['staff', 'mental health counselor', 'executive director'] }
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

    const { email, password, role, staffInfo } = req.body;

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
        if (['staff', 'mental health counselor', 'financial controller', 'executive director'].includes(role)) {
            if (!staffInfo) {
                return res.status(400).json({ success: false, message: 'Staff information is required for this role.' });
            }
            userData.staffInfo = staffInfo;
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
    const user = await User.findById(req.params.id);

    if (user) {
        user.email = req.body.email || user.email;
        user.role = req.body.role || user.role;
        user.staffInfo = req.body.staffInfo || user.staffInfo;
        // Note: Password updates should be handled separately for security.

        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
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
