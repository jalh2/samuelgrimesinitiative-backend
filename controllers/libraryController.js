const LibraryMaterial = require('../models/LibraryMaterial');
const Course = require('../models/Course');

// @desc    Upload a new library material
// @route   POST /api/library/upload
// @access  Private/Admin
exports.uploadMaterial = async (req, res) => {
    const { title, description, courseId, type } = req.body;

    if (!req.file && type === 'document') {
        return res.status(400).json({ message: 'Please upload a file for document type materials.' });
    }

    try {
        let content;
        if (type === 'document') {
            // Convert the file buffer to a Base64 string
            content = req.file.buffer.toString('base64');
        } else {
            content = req.body.content; // For 'video' (URL) or 'text'
        }

        const newMaterial = new LibraryMaterial({
            title,
            description,
            course: courseId,
            type,
            content,
            uploadedBy: req.user.id
        });

        const savedMaterial = await newMaterial.save();

        // Add the material to the corresponding course
        await Course.findByIdAndUpdate(courseId, { $push: { materials: savedMaterial._id } });

        res.status(201).json(savedMaterial);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all materials for a specific course
// @route   GET /api/library/course/:courseId
// @access  Public
exports.getMaterialsByCourse = async (req, res) => {
    try {
        const materials = await LibraryMaterial.find({ course: req.params.courseId });
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Download a library material
// @route   GET /api/library/download/:id
// @access  Public
exports.downloadMaterial = async (req, res) => {
    try {
        const material = await LibraryMaterial.findById(req.params.id);
        if (!material || material.type !== 'document') {
            return res.status(404).json({ message: 'Document not found' });
        }

        // Decode the Base64 string to a buffer
        const fileBuffer = Buffer.from(material.content, 'base64');

        // Set headers to prompt download
        res.setHeader('Content-Disposition', `attachment; filename="${material.title}.pdf"`); // Assuming PDF, adjust as needed
        res.setHeader('Content-Type', 'application/pdf');
        res.send(fileBuffer);

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update a library material
// @route   PUT /api/library/:id
// @access  Private/Admin
exports.updateMaterial = async (req, res) => {
    try {
        const updatedMaterial = await LibraryMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedMaterial) {
            return res.status(404).json({ message: 'Material not found' });
        }
        res.status(200).json(updatedMaterial);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a library material
// @route   DELETE /api/library/:id
// @access  Private/Admin
exports.deleteMaterial = async (req, res) => {
    try {
        const material = await LibraryMaterial.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // Remove the material from the course's list
        await Course.findByIdAndUpdate(material.course, { $pull: { materials: material._id } });

        await material.remove();
        res.status(200).json({ message: 'Material removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all library materials
// @route   GET /api/library
// @access  Private/Admin
exports.getAllMaterials = async (req, res) => {
    try {
        const materials = await LibraryMaterial.find({});
        res.status(200).json(materials);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
