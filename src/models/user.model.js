// Import necessary libraries
import mongoose from 'mongoose'; // Mongoose is used to interact with MongoDB.
import jwt from 'jsonwebtoken'; // For generating JSON Web Tokens (JWT) used for authentication.
import bcrypt from 'bcrypt'; // For hashing passwords securely.

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    // Username field: unique identifier for users
    username: {
        type: String, // Data type is String
        required: true, // Field is required
        unique: true, // Must be unique across the database
        lowercase: true, // Converts to lowercase before saving
        trim: true, // Removes leading and trailing whitespace
        index: true // Creates an index for faster querying
    },
    // Email field: also unique and required
    email: {
        type: String, // Data type is String
        required: true, // Field is required
        unique: true, // Must be unique across the database
        lowercase: true, // Converts to lowercase before saving
        trim: true // Removes leading and trailing whitespace
    },
    // Full name of the user
    fullname: {
        type: String, // Data type is String
        required: true, // Field is required
        trim: true, // Removes leading and trailing whitespace
        index: true // Creates an index for faster querying
    },
    // URL or path for the user's avatar image
    avatar: {
        type: String, // Data type is String
        required: true // Field is required
    },
    // URL or path for the user's cover image (optional)
    coverImage: {
        type: String, // Data type is String
    },
    // List of videos the user has watched
    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId, // References IDs from the "Video" collection
            ref: "Video" // Indicates that this field is a reference to the "Video" model
        }
    ],
    // Password field: hashed before saving
    password: {
        type: String, // Data type is String
        required: [true, 'Password is required'] // Field is required with a custom error message
    },
    // Refresh token for managing long-term authentication
    refreshToken: {
        type: String // Data type is String
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Pre-save middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified("password")) return next();
    // Hash the password with a salt factor of 10
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Proceed to the next middleware or save operation
});

// Instance method to compare a plain text password with the hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password); // Returns true if passwords match
};

// Instance method to generate an access token for authentication
userSchema.methods.generateAccessToken = function () {
    // Sign a JWT with the user's details and a secret key
    return jwt.sign({
        _id: this._id, // User ID
        email: this.email, // User email
        username: this.username, // Username
        fullname: this.fullname // Full name
    }, process.env.ACCESS_TOKEN_SECRET, { // Secret key for signing the token
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY // Expiry duration for the token
    });
};

// Instance method to generate a refresh token for long-term sessions
userSchema.methods.generateRefreshToken = function () {
    // Sign a JWT with the user's details and a different secret key
    return jwt.sign({
        _id: this._id, // User ID
        email: this.email, // User email
        username: this.username, // Username
        fullname: this.fullname // Full name
    }, process.env.REFRESH_TOKEN_SECRET, { // Secret key for signing the refresh token
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY // Expiry duration for the refresh token
    });
};

// Create and export the User model based on the schema
export const User = mongoose.model('User', userSchema); // Model name is "User"
