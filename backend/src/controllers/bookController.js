/**
 * Book Controller
 * Handles book CRUD operations
 */

const Book = require('../models/Book');

/**
 * Get all books with optional filtering
 * GET /api/books
 */
const getBooks = async (req, res) => {
    try {
        const { category, type, featured, search, limit, page } = req.query;

        let query = {};

        // Category filter
        if (category && category !== 'all') {
            query.category = category;
        }

        // Type filter (book/video)
        if (type && type !== 'all') {
            query.type = type;
        }

        // Featured filter
        if (featured === 'true') {
            query.featured = true;
        }

        // Search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50;
        const skip = (pageNum - 1) * limitNum;

        const books = await Book.find(query)
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Book.countDocuments(query);

        res.json({
            success: true,
            count: books.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: books
        });
    } catch (error) {
        console.error('Get books error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση βιβλίων.'
        });
    }
};

/**
 * Get featured books
 * GET /api/books/featured
 */
const getFeaturedBooks = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const books = await Book.find({ featured: true }).limit(limit);

        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Get featured books error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση επιλεγμένων βιβλίων.'
        });
    }
};

/**
 * Get all categories
 * GET /api/books/categories
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Book.distinct('category');
        res.json({
            success: true,
            data: ['all', ...categories]
        });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση κατηγοριών.'
        });
    }
};

/**
 * Get book by ID
 * GET /api/books/:id
 */
const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Το βιβλίο δεν βρέθηκε.'
            });
        }

        res.json({
            success: true,
            data: book
        });
    } catch (error) {
        console.error('Get book by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση βιβλίου.'
        });
    }
};

/**
 * Search books
 * GET /api/books/search
 */
const searchBooks = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Παρακαλώ εισάγετε όρο αναζήτησης.'
            });
        }

        const books = await Book.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { author: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ]
        });

        res.json({
            success: true,
            count: books.length,
            data: books
        });
    } catch (error) {
        console.error('Search books error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την αναζήτηση.'
        });
    }
};

module.exports = {
    getBooks,
    getFeaturedBooks,
    getCategories,
    getBookById,
    searchBooks
};
