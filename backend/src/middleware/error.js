/**
 * Error Handling Middleware
 */

/**
 * Custom error class
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * 404 Not Found handler
 */
const notFound = (req, res, next) => {
    const error = new AppError(`Το endpoint ${req.originalUrl} δεν βρέθηκε`, 404);
    next(error);
};

/**
 * Global error handler
 */
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    if (process.env.NODE_ENV === 'development') {
        console.error('Error:', err);
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error = new AppError('Μη έγκυρο ID', 400);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        error = new AppError(`Το ${field} χρησιμοποιείται ήδη.`, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        error = new AppError(messages.join('. '), 400);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = new AppError('Μη έγκυρο token', 401);
    }

    if (err.name === 'TokenExpiredError') {
        error = new AppError('Το token έχει λήξει', 401);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Σφάλμα διακομιστή',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { AppError, notFound, errorHandler };
