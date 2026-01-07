/**
 * Book Routes
 */

const express = require('express');
const router = express.Router();
const {
    getBooks,
    getFeaturedBooks,
    getCategories,
    getBookById,
    searchBooks
} = require('../controllers/bookController');

// Public routes
router.get('/', getBooks);
router.get('/featured', getFeaturedBooks);
router.get('/categories', getCategories);
router.get('/search', searchBooks);
router.get('/:id', getBookById);

module.exports = router;
