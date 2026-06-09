const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Define routes and connect them to controller functions
router.post('/register', register);
router.post('/login', login);

module.exports = router;