const WebsiteContent = require('../models/WebsiteContent');

// @desc    Get all content for a specific page
// @route   GET /api/content/:page
// @access  Public
exports.getNavigationPages = async (req, res) => {
    try {
        const pages = await WebsiteContent.distinct('page');
        // Filter out pages that might not be for navigation, e.g., 'home'
        const navPages = pages.filter(page => page !== 'home');
        // A simple sort to maintain a consistent order
        navPages.sort();
        res.status(200).json(navPages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getContentByPage = async (req, res) => {
    try {
        const content = await WebsiteContent.find({ page: req.params.page }).sort({ order: 'asc' });
        if (!content || content.length === 0) {
            return res.status(404).json({ message: `No content found for page: ${req.params.page}` });
        }
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all website content
// @route   GET /api/content
// @access  Private/Admin
exports.getAllContent = async (req, res) => {
    try {
        const allContent = await WebsiteContent.find({}).sort({ page: 'asc', order: 'asc' });
        res.status(200).json(allContent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new content block
// @route   POST /api/content
// @access  Private/Admin
exports.createContent = async (req, res) => {
    const { page, section, order, content } = req.body;
    try {
        const newContent = new WebsiteContent({ page, section, order, content });
        const savedContent = await newContent.save();
        res.status(201).json(savedContent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a content block
// @route   PUT /api/content/:id
// @access  Private/Admin
exports.updateContent = async (req, res) => {
    try {
        const updatedContent = await WebsiteContent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedContent) {
            return res.status(404).json({ message: 'Content not found' });
        }
        res.status(200).json(updatedContent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a content block
// @route   DELETE /api/content/:id
// @access  Private/Admin
exports.deleteContent = async (req, res) => {
    try {
        const content = await WebsiteContent.findById(req.params.id);
        if (!content) {
            return res.status(404).json({ message: 'Content not found' });
        }
        await content.remove();
        res.status(200).json({ message: 'Content removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
