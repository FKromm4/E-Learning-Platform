/**
 * Book Model
 */

const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Ο τίτλος είναι υποχρεωτικός'],
        trim: true,
        maxlength: [200, 'Ο τίτλος δεν μπορεί να υπερβαίνει τους 200 χαρακτήρες']
    },
    author: {
        type: String,
        required: [true, 'Ο συγγραφέας είναι υποχρεωτικός'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Η περιγραφή είναι υποχρεωτική'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Η κατηγορία είναι υποχρεωτική'],
        trim: true
    },
    type: {
        type: String,
        enum: ['book', 'video'],
        default: 'book'
    },
    pages: {
        type: Number,
        min: 0
    },
    duration: {
        type: String,
        trim: true
    },
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    image: {
        type: String,
        default: 'assets/img/books/default-book.jpg'
    },
    featured: {
        type: Boolean,
        default: false
    },
    topics: [{
        type: String,
        trim: true
    }],
    price: {
        type: String,
        default: 'Δωρεάν'
    },
    format: {
        type: String,
        default: 'PDF'
    }
}, {
    timestamps: true
});

// Indexes for search and filtering
bookSchema.index({ title: 'text', author: 'text', description: 'text', category: 'text' });
bookSchema.index({ category: 1 });
bookSchema.index({ type: 1 });
bookSchema.index({ featured: 1 });

module.exports = mongoose.model('Book', bookSchema);
