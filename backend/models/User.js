const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.isGoogleUser; // Password not required for Google users
        }
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows multiple null values
    },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
        default: '',
    },
    coverPic: {
        type: String,
        default: '',
    },
    bio: {
        type: String,
        default: '',
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
}, { timestamps: true });

// Hash password before saving (only for non-Google users)
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isGoogleUser) return next();
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
