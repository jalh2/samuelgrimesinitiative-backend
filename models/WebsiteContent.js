const mongoose = require('mongoose');

const websiteContentSchema = new mongoose.Schema({
    page: {
        type: String,
        required: true,
        enum: ['home', 'about', 'team', 'programs', 'donations', 'gallery', 'contact']
    },
    section: {
        type: String,
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    content: {
        type: mongoose.Schema.Types.Mixed, // Allows for flexible content structure
        required: true
    }
}, { timestamps: true });

// Create a compound index to ensure that each section on a page is unique
websiteContentSchema.index({ page: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('WebsiteContent', websiteContentSchema);
