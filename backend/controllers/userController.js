const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route   GET /api/users/profile
// @desc    Get current user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   PUT /api/users/profile
// @desc    Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        // Check if email is already used by another user
        if (email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email already in use' });
            }
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, phone, address },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   PATCH /api/users/password
// @desc    Change user password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({ message: 'All password fields are required' });
        }

        // Validate password length
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        // Check if new passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        // Get user with password
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};
