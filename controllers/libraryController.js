const LibraryMaterial = require('../models/LibraryMaterial');
const Course = require('../models/Course');

// @desc    Upload a new library material
// @route   POST /api/library/upload
// @access  Private/Admin
exports.uploadMaterial = async (req, res) => {
    const { title, description, courseId, type } = req.body;

    // Validate required fields
    if (!title) {
        return res.status(400).json({ message: 'Title is required.' });
    }

    if (!courseId) {
        return res.status(400).json({ message: 'Course selection is required.' });
    }

    if (!type) {
        return res.status(400).json({ message: 'Material type is required.' });
    }

    if (!req.file && type === 'document') {
        return res.status(400).json({ message: 'Please upload a file for document type materials.' });
    }

    try {
        // Validate that the course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(400).json({ message: 'Selected course does not exist.' });
        }

        let content;
        if (type === 'document') {
            // Convert the file buffer to a Base64 string
            content = req.file.buffer.toString('base64');
        } else if (type === 'video' || type === 'text') {
            content = req.body.content; // For 'video' (URL) or 'text'
            if (!content) {
                return res.status(400).json({ message: 'Content is required for video and text materials.' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid material type.' });
        }

        const newMaterial = new LibraryMaterial({
            title,
            description,
            course: courseId,
            type,
            content,
            uploadedBy: req.user.id,
            originalFileName: type === 'document' ? req.file.originalname : undefined,
            mimeType: type === 'document' ? req.file.mimetype : undefined
        });

        const savedMaterial = await newMaterial.save();

        // Add the material to the corresponding course
        await Course.findByIdAndUpdate(courseId, { $push: { materials: savedMaterial._id } });

        res.status(201).json(savedMaterial);
    } catch (error) {
        console.error('Error uploading material:', error);
        res.status(500).json({ message: 'Server error while uploading material', error: error.message });
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

        // Set headers to prompt download with correct filename and MIME type
        const filename = material.originalFileName || `${material.title}.bin`;
        const mimeType = material.mimeType || 'application/octet-stream';
        
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', mimeType);
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
        // Validate that the material exists
        const existingMaterial = await LibraryMaterial.findById(req.params.id);
        if (!existingMaterial) {
            return res.status(404).json({ message: 'Material not found' });
        }

        // If course is being updated, validate that the new course exists
        if (req.body.course && req.body.course !== existingMaterial.course) {
            const course = await Course.findById(req.body.course);
            if (!course) {
                return res.status(400).json({ message: 'Selected course does not exist.' });
            }
            
            // Remove material from old course
            await Course.findByIdAndUpdate(existingMaterial.course, { $pull: { materials: existingMaterial._id } });
            
            // Add material to new course
            await Course.findByIdAndUpdate(req.body.course, { $push: { materials: existingMaterial._id } });
        }

        const updatedMaterial = await LibraryMaterial.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedMaterial);
    } catch (error) {
        console.error('Error updating material:', error);
        res.status(500).json({ message: 'Server error while updating material', error: error.message });
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

        // Remove the material from the course's list (if course exists and material is linked)
        if (material.course) {
            try {
                await Course.findByIdAndUpdate(material.course, { $pull: { materials: material._id } });
            } catch (courseError) {
                console.warn('Warning: Could not remove material from course:', courseError.message);
                // Continue with deletion even if course update fails
            }
        }

        await LibraryMaterial.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Material removed successfully' });
    } catch (error) {
        console.error('Error deleting material:', error);
        res.status(500).json({ message: 'Server error while deleting material', error: error.message });
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
