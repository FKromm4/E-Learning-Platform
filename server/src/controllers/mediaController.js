/**
 * Media Controller
 * Handles file uploads
 */

const path = require('path');
const fs = require('fs');

/**
 * Upload image
 * POST /api/media/upload
 */
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Δεν επιλέχθηκε αρχείο.'
            });
        }

        res.json({
            success: true,
            message: 'Το αρχείο ανέβηκε επιτυχώς!',
            data: {
                filename: req.file.filename,
                path: `/uploads/${req.file.filename}`,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά το ανέβασμα αρχείου.'
        });
    }
};

/**
 * Delete image
 * DELETE /api/media/:filename
 */
const deleteImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const filepath = path.join(__dirname, '../../uploads', filename);

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
            res.json({
                success: true,
                message: 'Το αρχείο διαγράφηκε επιτυχώς!'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Το αρχείο δεν βρέθηκε.'
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά τη διαγραφή αρχείου.'
        });
    }
};

module.exports = { uploadImage, deleteImage };
