const mongoose = require('mongoose');

const libraryMaterialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    type: {
        type: String,
        enum: ['document', 'video', 'text'],
        required: true
    },
    content: {
        type: String, // Can be a Base64 string, URL, or plain text
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('LibraryMaterial', libraryMaterialSchema);
