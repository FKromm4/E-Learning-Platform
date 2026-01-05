/**
 * Course Model
 */

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Ο τίτλος είναι υποχρεωτικός'],
        trim: true,
        maxlength: [200, 'Ο τίτλος δεν μπορεί να υπερβαίνει τους 200 χαρακτήρες']
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
    instructor: {
        type: String,
        required: [true, 'Ο εισηγητής είναι υποχρεωτικός'],
        trim: true
    },
    duration: {
        type: String,
        required: true,
        trim: true
    },
    level: {
        type: String,
        enum: ['Αρχάριο', 'Μεσαίο', 'Προχωρημένο'],
        required: true
    },
    students: {
        type: Number,
        default: 0
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    image: {
        type: String,
        default: 'assets/img/courses/default-course.jpg'
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
    }
}, {
    timestamps: true
});

// Indexes for search and filtering
courseSchema.index({ title: 'text', description: 'text', category: 'text' });
courseSchema.index({ category: 1 });
courseSchema.index({ featured: 1 });
courseSchema.index({ level: 1 });

module.exports = mongoose.model('Course', courseSchema);
