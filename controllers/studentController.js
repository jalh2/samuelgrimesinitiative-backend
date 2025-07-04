const Student = require('../models/Student');
const User = require('../models/User');

// @desc    Create a new student
// @route   POST /api/students
// @access  Private/Admin
exports.createStudent = async (req, res) => {
    const { email, password, personalInformation, parentGuardianInformation, courseOfStudy } = req.body;

    try {
        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        // Create a new user for the student
        const user = new User({ email, role: 'Student' });
        user.setPassword(password);
        const savedUser = await user.save();

        // Create the student profile
        const student = new Student({
            userId: savedUser._id,
            personalInformation,
            parentGuardianInformation,
            courseOfStudy
        });

        const savedStudent = await student.save();
        res.status(201).json(savedStudent);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({}).populate('userId', 'email isActive');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single student by ID
// @route   GET /api/students/:id
// @access  Private/Admin
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('userId', 'email isActive');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private/Admin
exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Admin
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Also delete the associated user account
        await User.findByIdAndDelete(student.userId);
        await student.remove();

        res.status(200).json({ message: 'Student and associated user account removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
