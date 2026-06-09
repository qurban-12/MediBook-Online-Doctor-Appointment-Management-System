const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/register
// @desc    Register a user (Patient or Admin)
exports.register = async (req, res) => {
    try {
        // If DB is not connected, return a clear 503 so frontend can show helpful message
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }
        const { name, email, password, role } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            name,
            email,
            password: hashedPassword,
            role
        });

        await user.save();

        // Following the requirement message: "Record created successfully"
        res.status(201).json({ message: 'Record created successfully' });
    } catch (error) {
        console.error(error);
        // If mongoose buffering/connection error, return 503 instead of generic 500
        if (error.name === 'MongooseError' || /buffering timed out/i.test(error.message || '')) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
exports.login = async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }
        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid input data' });
        }

        // Generate JWT token
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1d' }, // Token expires in 1 day
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
            }
        );
    } catch (error) {
        console.error(error.message);
        if (error.name === 'MongooseError' || /buffering timed out/i.test(error.message || '')) {
            return res.status(503).json({ message: 'Database unavailable. Please try again later.' });
        }
        res.status(500).json({ message: 'Something went wrong. Please try again later' });
    }
};