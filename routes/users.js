const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    verifyTokenEndpoint,
    getAllUsers
} = require('../controllers/usersController');

const verifyToken = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const router = express.Router();

// PUBLIC ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);

// PROTECTED ROUTES
router.get('/verify-token', verifyToken, verifyTokenEndpoint);
router.get('/get-all-users', verifyToken, authorize(['admin']), getAllUsers)
router.get('/get-user-profile', verifyToken, getUserProfile);

module.exports = router;
