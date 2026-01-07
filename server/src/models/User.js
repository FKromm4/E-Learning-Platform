/**
 * User Model
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const paymentMethodSchema = new mongoose.Schema({
    cardType: {
        type: String,
        enum: ['Visa', 'Mastercard', 'American Express', 'Κάρτα'],
        default: 'Κάρτα'
    },
    lastFour: {
        type: String,
        required: true
    },
    holderName: {
        type: String,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
}, { _id: true });

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Το όνομα είναι υποχρεωτικό'],
        trim: true,
        maxlength: [100, 'Το όνομα δεν μπορεί να υπερβαίνει τους 100 χαρακτήρες']
    },
    email: {
        type: String,
        required: [true, 'Το email είναι υποχρεωτικό'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Παρακαλώ εισάγετε έγκυρο email']
    },
    password: {
        type: String,
        required: [true, 'Ο κωδικός είναι υποχρεωτικός'],
        minlength: [8, 'Ο κωδικός πρέπει να έχει τουλάχιστον 8 χαρακτήρες'],
        select: false // Don't return password by default
    },
    interests: [{
        type: String,
        trim: true
    }],
    favourites: {
        courses: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }],
        books: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }]
    },
    paymentMethods: [paymentMethodSchema]
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Get public profile (without sensitive data)
userSchema.methods.toPublicJSON = function () {
    return {
        id: this._id,
        name: this.name,
        email: this.email,
        interests: this.interests,
        favourites: this.favourites,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('User', userSchema);
