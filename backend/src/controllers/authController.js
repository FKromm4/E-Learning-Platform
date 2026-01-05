/**
 * Auth Controller
 * Handles user registration, login, and authentication
 */

const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
    try {
        const { name, email, password, interests } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Το email χρησιμοποιείται ήδη.'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            interests: interests || []
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Η εγγραφή ολοκληρώθηκε επιτυχώς!',
            data: {
                token,
                user: user.toPublicJSON()
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την εγγραφή.',
            error: error.message
        });
    }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Λάθος email ή κωδικός.'
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Λάθος email ή κωδικός.'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Σύνδεση επιτυχής!',
            data: {
                token,
                user: user.toPublicJSON()
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά τη σύνδεση.',
            error: error.message
        });
    }
};

/**
 * Get current user
 * GET /api/auth/me
 */
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favourites.courses')
            .populate('favourites.books');

        res.json({
            success: true,
            data: {
                user: user.toPublicJSON()
            }
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση στοιχείων χρήστη.'
        });
    }
};

module.exports = { register, login, getMe };
