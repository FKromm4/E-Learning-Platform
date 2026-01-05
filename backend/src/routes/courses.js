/**
 * Course Routes
 */

const express = require('express');
const router = express.Router();
const {
    getCourses,
    getFeaturedCourses,
    getCategories,
    getCourseById,
    searchCourses
} = require('../controllers/courseController');

// Public routes
router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/categories', getCategories);
router.get('/search', searchCourses);
router.get('/:id', getCourseById);

module.exports = router;
