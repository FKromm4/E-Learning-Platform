/**
 * JWT Authentication Middleware
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - requires valid JWT token
 */
const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Δεν έχετε συνδεθεί. Παρακαλώ συνδεθείτε για να συνεχίσετε.'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Ο χρήστης δεν βρέθηκε.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Μη έγκυρο token. Παρακαλώ συνδεθείτε ξανά.'
        });
    }
};

/**
 * Optional auth - allows both authenticated and non-authenticated requests
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        }

        next();
    } catch (error) {
        // Token is invalid but we still continue (optional auth)
        next();
    }
};

/**
 * Generate JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

module.exports = { protect, optionalAuth, generateToken };
