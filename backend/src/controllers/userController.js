/**
 * User Controller
 * Handles user profile, favourites, and payment methods
 */

const User = require('../models/User');
const Course = require('../models/Course');
const Book = require('../models/Book');
const bcrypt = require('bcryptjs');

/**
 * Get user profile
 * GET /api/user/profile
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favourites.courses')
            .populate('favourites.books');

        res.json({
            success: true,
            data: user.toPublicJSON()
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση προφίλ.'
        });
    }
};

/**
 * Update user profile
 * PUT /api/user/profile
 */
const updateProfile = async (req, res) => {
    try {
        const { name, interests } = req.body;

        const user = await User.findById(req.user._id);

        if (name) user.name = name;
        if (interests) user.interests = interests;

        await user.save();

        res.json({
            success: true,
            message: 'Το προφίλ ενημερώθηκε επιτυχώς!',
            data: user.toPublicJSON()
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ενημέρωση προφίλ.'
        });
    }
};

/**
 * Change password
 * PUT /api/user/password
 */
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        // Check current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Ο τρέχων κωδικός είναι λάθος.'
            });
        }

        // Update password
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Ο κωδικός άλλαξε επιτυχώς!'
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την αλλαγή κωδικού.'
        });
    }
};

/**
 * Get user favourites
 * GET /api/user/favourites
 */
const getFavourites = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate('favourites.courses')
            .populate('favourites.books');

        res.json({
            success: true,
            data: {
                courses: user.favourites.courses || [],
                books: user.favourites.books || []
            }
        });
    } catch (error) {
        console.error('Get favourites error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση αγαπημένων.'
        });
    }
};

/**
 * Add to favourites
 * POST /api/user/favourites/:type/:id
 */
const addToFavourites = async (req, res) => {
    try {
        const { type, id } = req.params;
        const user = await User.findById(req.user._id);

        if (type !== 'course' && type !== 'book') {
            return res.status(400).json({
                success: false,
                message: 'Μη έγκυρος τύπος. Χρησιμοποιήστε "course" ή "book".'
            });
        }

        // Verify item exists
        if (type === 'course') {
            const course = await Course.findById(id);
            if (!course) {
                return res.status(404).json({
                    success: false,
                    message: 'Το μάθημα δεν βρέθηκε.'
                });
            }

            if (!user.favourites.courses.includes(id)) {
                user.favourites.courses.push(id);
            }
        } else {
            const book = await Book.findById(id);
            if (!book) {
                return res.status(404).json({
                    success: false,
                    message: 'Το βιβλίο δεν βρέθηκε.'
                });
            }

            if (!user.favourites.books.includes(id)) {
                user.favourites.books.push(id);
            }
        }

        await user.save();

        res.json({
            success: true,
            message: 'Προστέθηκε στα αγαπημένα!'
        });
    } catch (error) {
        console.error('Add to favourites error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την προσθήκη στα αγαπημένα.'
        });
    }
};

/**
 * Remove from favourites
 * DELETE /api/user/favourites/:type/:id
 */
const removeFromFavourites = async (req, res) => {
    try {
        const { type, id } = req.params;
        const user = await User.findById(req.user._id);

        if (type !== 'course' && type !== 'book') {
            return res.status(400).json({
                success: false,
                message: 'Μη έγκυρος τύπος. Χρησιμοποιήστε "course" ή "book".'
            });
        }

        if (type === 'course') {
            user.favourites.courses = user.favourites.courses.filter(
                courseId => courseId.toString() !== id
            );
        } else {
            user.favourites.books = user.favourites.books.filter(
                bookId => bookId.toString() !== id
            );
        }

        await user.save();

        res.json({
            success: true,
            message: 'Αφαιρέθηκε από τα αγαπημένα!'
        });
    } catch (error) {
        console.error('Remove from favourites error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την αφαίρεση από τα αγαπημένα.'
        });
    }
};

/**
 * Get payment methods
 * GET /api/user/payment-methods
 */
const getPaymentMethods = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: user.paymentMethods || []
        });
    } catch (error) {
        console.error('Get payment methods error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ανάκτηση μεθόδων πληρωμής.'
        });
    }
};

/**
 * Add payment method
 * POST /api/user/payment-methods
 */
const addPaymentMethod = async (req, res) => {
    try {
        const { cardType, lastFour, holderName, expiry } = req.body;
        const user = await User.findById(req.user._id);

        const isFirst = user.paymentMethods.length === 0;

        user.paymentMethods.push({
            cardType,
            lastFour,
            holderName: holderName.toUpperCase(),
            expiry,
            isDefault: isFirst
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Η κάρτα προστέθηκε επιτυχώς!',
            data: user.paymentMethods
        });
    } catch (error) {
        console.error('Add payment method error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την προσθήκη κάρτας.'
        });
    }
};

/**
 * Remove payment method
 * DELETE /api/user/payment-methods/:id
 */
const removePaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const cardId = req.params.id;

        const cardIndex = user.paymentMethods.findIndex(
            card => card._id.toString() === cardId
        );

        if (cardIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Η κάρτα δεν βρέθηκε.'
            });
        }

        const wasDefault = user.paymentMethods[cardIndex].isDefault;
        user.paymentMethods.splice(cardIndex, 1);

        // Set new default if needed
        if (wasDefault && user.paymentMethods.length > 0) {
            user.paymentMethods[0].isDefault = true;
        }

        await user.save();

        res.json({
            success: true,
            message: 'Η κάρτα αφαιρέθηκε επιτυχώς!',
            data: user.paymentMethods
        });
    } catch (error) {
        console.error('Remove payment method error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την αφαίρεση κάρτας.'
        });
    }
};

/**
 * Set default payment method
 * PUT /api/user/payment-methods/:id/default
 */
const setDefaultPaymentMethod = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const cardId = req.params.id;

        const card = user.paymentMethods.find(
            c => c._id.toString() === cardId
        );

        if (!card) {
            return res.status(404).json({
                success: false,
                message: 'Η κάρτα δεν βρέθηκε.'
            });
        }

        // Update all cards
        user.paymentMethods.forEach(c => {
            c.isDefault = c._id.toString() === cardId;
        });

        await user.save();

        res.json({
            success: true,
            message: 'Η προεπιλεγμένη κάρτα ενημερώθηκε!',
            data: user.paymentMethods
        });
    } catch (error) {
        console.error('Set default payment method error:', error);
        res.status(500).json({
            success: false,
            message: 'Σφάλμα κατά την ενημέρωση προεπιλεγμένης κάρτας.'
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    changePassword,
    getFavourites,
    addToFavourites,
    removeFromFavourites,
    getPaymentMethods,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod
};
