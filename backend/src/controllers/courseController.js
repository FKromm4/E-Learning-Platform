/**
 * Course Controller
 * Handles course CRUD operations
 */

const Course = require('../models/Course');

/**
 * Get all courses with optional filtering
 * GET /api/courses
 */
const getCourses = async (req, res) => {
    try {
        const { category, level, featured, search, limit, page } = req.query;

        let query = {};

        // Category filter
        if (category && category !== 'all') {
            query.category = category;
        }

        // Level filter
        if (level && level !== 'all') {
            query.level = level;
        }

        // Featured filter
        if (featured === 'true') {
            query.featured = true;
        }

        // Search
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        // Pagination
        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50;
        const skip = (pageNum - 1) * limitNum;

        const courses = await Course.find(query)
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Course.countDocuments(query);

        res.json({
            success: true,
            count: courses.length,
            total,
            page: pageNum,
            pages: Math.ceil(total / limitNum),
            data: courses
        });
    } catch (error) {
        console.error('Get courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση μαθημάτων.'
        });
    }
};

/**
 * Get featured courses
 * GET /api/courses/featured
 */
const getFeaturedCourses = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const courses = await Course.find({ featured: true }).limit(limit);

        res.json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        console.error('Get featured courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση επιλεγμένων μαθημάτων.'
        });
    }
};

/**
 * Get all categories
 * GET /api/courses/categories
 */
const getCategories = async (req, res) => {
    try {
        const categories = await Course.distinct('category');
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
 * Get course by ID
 * GET /api/courses/:id
 */
const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Το μάθημα δεν βρέθηκε.'
            });
        }

        res.json({
            success: true,
            data: course
        });
    } catch (error) {
        console.error('Get course by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση μαθήματος.'
        });
    }
};

/**
 * Search courses
 * GET /api/courses/search
 */
const searchCourses = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Παρακαλώ εισάγετε όρο αναζήτησης.'
            });
        }

        const courses = await Course.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ]
        });

        res.json({
            success: true,
            count: courses.length,
            data: courses
        });
    } catch (error) {
        console.error('Search courses error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την αναζήτηση.'
        });
    }
};

module.exports = {
    getCourses,
    getFeaturedCourses,
    getCategories,
    getCourseById,
    searchCourses
};
