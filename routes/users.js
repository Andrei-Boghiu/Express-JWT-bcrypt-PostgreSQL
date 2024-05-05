const express = require('express');
const usersController = require('../controllers/usersController');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

// Public routes
router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);

// Protected routes
router.get('/profile', verifyToken, usersController.getUserProfile); // Protected route

module.exports = router;
