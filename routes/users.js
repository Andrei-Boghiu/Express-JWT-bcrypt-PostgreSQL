const express = require('express');
const { registerUser, loginUser, getUserProfile } = require('../controllers/usersController');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

// PUBLIC ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);

// PROTECTED ROUTES
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
