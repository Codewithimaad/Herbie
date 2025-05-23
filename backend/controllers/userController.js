import User from '../models/User.js';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import upload from '../config/upload.js'

// Validation middleware for password change
export const validatePasswordChange = [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
        .notEmpty().withMessage('New password is required'),
];

// Get current user's profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // from auth middleware
        const user = await User.findById(userId).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, location, bio } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, email, location, bio },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};





export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id; // From auth middleware (authUser)

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current password and new password are required' });
        }

        // Additional validation for newPassword
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'New password must be at least 8 characters' });
        }

        // Get user from database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect', error: 'INCORRECT_PASSWORD' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        // Optionally: invalidate existing tokens if using JWT (e.g., update a token version)
        // Example: user.tokenVersion += 1; await user.save();

        return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}


// Controller for avatar upload
export const uploadAvatar = [
    // Multer middleware to handle single file upload with field name 'avatar'
    upload.single('avatar'),
    async (req, res) => {
        try {
            const userId = req.user.id; // From authUser middleware
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized: No user ID found' });
            }

            // Check if file was uploaded
            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Get the Cloudinary URL from the upload result
            const avatarUrl = req.file.path; // CloudinaryStorage sets req.file.path to the Cloudinary URL

            // Find user and update avatar field
            const user = await User.findByIdAndUpdate(
                userId,
                { avatar: avatarUrl },
                { new: true, runValidators: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ avatar: avatarUrl });
        } catch (error) {
            console.error('Error uploading avatar to Cloudinary:', error);
            res.status(500).json({ message: error.message || 'Server error' });
        }
    }
];