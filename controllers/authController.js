const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    const { email, password, role, staffInfo } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            email,
            role,
            staffInfo
        });

        user.setPassword(password);

        await user.save();

        if (user) {
            res.status(201).json({
                _id: user._id,
                email: user.email,
                role: user.role.toLowerCase(),
                token: generateToken(user._id.toString(), user.role.toLowerCase()),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await user.validPassword(password))) {
            // Ensure the user has a role assigned
            if (!user.role) {
                return res.status(401).json({ message: 'User account is not configured correctly. Please contact an administrator.' });
            }

            res.json({
                _id: user._id,
                email: user.email,
                role: user.role.toLowerCase(),
                token: generateToken(user._id.toString(), user.role.toLowerCase()),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
