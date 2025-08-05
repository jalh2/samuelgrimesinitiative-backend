const WebsiteContent = require('../models/WebsiteContent');

// @desc    Get all content for a specific page
// @route   GET /api/content/:page
// @access  Public
exports.getNavigationPages = async (req, res) => {
    console.log('INFO: Fetching navigation pages...');
    try {
        const pages = await WebsiteContent.distinct('page');
        const navPages = pages.filter(page => page !== 'home').sort();
        console.log(`SUCCESS: Fetched ${navPages.length} navigation pages.`);
        res.status(200).json(navPages);
    } catch (error) {
        console.error('ERROR: Failed to fetch navigation pages:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getContentByPage = async (req, res) => {
    console.log(`INFO: Fetching content for page: ${req.params.page}...`);
    try {
        const content = await WebsiteContent.find({ page: req.params.page }).sort({ order: 'asc' });
        if (!content || content.length === 0) {
            console.warn(`WARN: No content found for page: ${req.params.page}`);
            return res.status(404).json({ message: `No content found for page: ${req.params.page}` });
        }
        console.log(`SUCCESS: Fetched ${content.length} sections for page: ${req.params.page}.`);
        res.status(200).json(content);
    } catch (error) {
        console.error(`ERROR: Failed to fetch content for page: ${req.params.page}:`, error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all website content
// @route   GET /api/content
// @access  Private/Admin
exports.getAllContent = async (req, res) => {
    console.log('INFO: Fetching all website content for admin...');
    try {
        const allContent = await WebsiteContent.find({}).sort({ page: 'asc', order: 'asc' });
        console.log(`SUCCESS: Fetched ${allContent.length} total content documents.`);
        res.status(200).json(allContent);
    } catch (error) {
        console.error('ERROR: Failed to fetch all content:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create a new content block
// @route   POST /api/content
// @access  Private/Admin
exports.createContent = async (req, res) => {
    console.log('INFO: Attempting to create new content...');
    console.log('INFO: Received data:', JSON.stringify(req.body, null, 2));
    const { page, section, order, content } = req.body;
    try {
        const newContent = new WebsiteContent({ page, section, order, content });
        const savedContent = await newContent.save();
        console.log('SUCCESS: Content created successfully with ID:', savedContent._id);
        res.status(201).json(savedContent);
    } catch (error) {
        console.error('ERROR: Failed to create content:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a content block
// @route   PUT /api/content/:id
// @access  Private/Admin
exports.updateContent = async (req, res) => {
    console.log(`INFO: Attempting to update content with ID: ${req.params.id}...`);
    console.log('INFO: Received data for update:', JSON.stringify(req.body, null, 2));
    try {
        const updatedContent = await WebsiteContent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedContent) {
            console.warn(`WARN: No content found to update for ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Content not found' });
        }
        console.log('SUCCESS: Content updated successfully for ID:', req.params.id);
        res.status(200).json(updatedContent);
    } catch (error) {
        console.error(`ERROR: Failed to update content for ID: ${req.params.id}:`, error);
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
