const User = require('../models/User');
const bcryptjs = require('bcryptjs');

// @route   GET /api/users/profile
// @desc    Get authenticated user's profile
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
// @desc    Update user profile (name, email, phone, address)
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            { name, email, phone, address },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error.message);
        if (error.code === 11000 && error.keyPattern.email) {
            return res.status(400).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   PATCH /api/users/password
// @desc    Change user password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate required fields
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Current and new passwords are required' });
        }

        // Validate new password length
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'New password must be at least 6 characters' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify current password
        const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcryptjs.hash(newPassword, 10);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};
