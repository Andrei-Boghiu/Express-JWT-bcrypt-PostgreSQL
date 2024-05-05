const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    verifyTokenEndpoint,
} = require('../controllers/usersController');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

// PUBLIC ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);

// PROTECTED ROUTES
router.get('/verify-token', verifyToken, verifyTokenEndpoint);
router.get('/profile', verifyToken, getUserProfile);

module.exports = router;
