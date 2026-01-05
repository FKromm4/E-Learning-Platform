/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
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
} = require('../controllers/userController');

// All routes require authentication
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', changePassword);

// Favourites routes
router.get('/favourites', getFavourites);
router.post('/favourites/:type/:id', addToFavourites);
router.delete('/favourites/:type/:id', removeFromFavourites);

// Payment methods routes
router.get('/payment-methods', getPaymentMethods);
router.post('/payment-methods', addPaymentMethod);
router.delete('/payment-methods/:id', removePaymentMethod);
router.put('/payment-methods/:id/default', setDefaultPaymentMethod);

module.exports = router;
