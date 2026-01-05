/**
 * Media Routes
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth');
const { uploadImage, deleteImage } = require('../controllers/mediaController');

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Μη υποστηριζόμενος τύπος αρχείου. Επιτρέπονται μόνο JPEG, PNG, GIF, WEBP.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
    }
});

// Routes
router.post('/upload', protect, upload.single('image'), uploadImage);
router.delete('/:filename', protect, deleteImage);

module.exports = router;
