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
router.get('/profile', auth, getProfile); // GET: Fetch user profile (authenticated)

router.put(
    '/profile',
    auth,
    [
        check('name', 'Name is required').notEmpty(),
        check('email', 'Valid email is required').isEmail()
    ],
    validateRequest,
    updateProfile
); // PUT: Update user profile (authenticated)

router.patch(
    '/password',
    auth,
    [
        check('currentPassword', 'Current password is required').notEmpty(),
        check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 })
    ],
    validateRequest,
    changePassword
); // PATCH: Change password (authenticated)

module.exports = router;
