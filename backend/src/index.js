/**
 * E-Learning Platform Backend - Main Entry Point
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/error');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const mediaRoutes = require('./routes/media');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration - allow all origins in development
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/user', userRoutes);
app.use('/api/media', mediaRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'E-Learning API is running' });
});

// Root API info endpoint
app.get('/api', (req, res) => {
    res.json({
        success: true,
        message: 'E-Learning API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            courses: '/api/courses',
            books: '/api/books',
            user: '/api/user',
            media: '/api/media'
        }
    });
});

// Prevent favicon 404 errors
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 E-Learning API: http://localhost:${PORT}/api`);
});

module.exports = app;
