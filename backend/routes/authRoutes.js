const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { check } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');

// Define routes and connect them to controller functions with validation
router.post(
	'/register',
	[
		check('name', 'Name is required').notEmpty(),
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
	],
	validateRequest,
	register
);

router.post(
	'/login',
	[
		check('email', 'Please include a valid email').isEmail(),
		check('password', 'Password is required').exists()
	],
	validateRequest,
	login
);

module.exports = router;