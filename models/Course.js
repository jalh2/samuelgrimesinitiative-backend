const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Refers to a staff member
    },
    // An array of materials associated with this course
    materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LibraryMaterial'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
