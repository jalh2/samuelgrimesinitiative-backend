const mongoose = require('mongoose');
const crypto = require('crypto');

// Sub-schema for staff-specific information
const staffInfoSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    position: {
        type: String,
        required: true
    },
    employmentStatus: {
        type: String,
        enum: ['full-time', 'part-time'],
        required: true
    }
}, { _id: false });


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['student', 'patient', 'staff', 'nurse', 'mental health counselor', 'financial controller', 'executive director', 'admin'],
        default: 'student'
    },
    hash: String,
    salt: String,
    staffInfo: {
        type: staffInfoSchema,
        // Only include staffInfo if the role is one of the staff types
        required: function() {
            return ['staff', 'nurse', 'mental health counselor', 'financial controller', 'executive director'].includes(this.role);
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: function() {
            return this.role === 'student';
        }
    }
}, { timestamps: true });

// Method to set password
userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Method to validate password
userSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

module.exports = mongoose.model('User', userSchema);
