const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const auth = require('../middleware/auth');
const {
    getProfile,
    updateProfile,
    changePassword
} = require('../controllers/userController');

// Define API routes for users
router.get('/profile', auth, getProfile); // GET: Fetch current user profile

router.put(
    '/profile',
    auth,
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Email is required').isEmail()
    ],
    validateRequest,
    updateProfile
); // PUT: Update user profile

router.patch(
    '/password',
    auth,
    [
        check('currentPassword', 'Current password is required').notEmpty(),
        check('newPassword', 'New password is required').notEmpty(),
        check('confirmPassword', 'Confirm password is required').notEmpty()
    ],
    validateRequest,
    changePassword
); // PATCH: Change user password

module.exports = router;
