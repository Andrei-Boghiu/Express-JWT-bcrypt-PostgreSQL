const express = require('express');
const router = express.Router();

// Middleware
const verifyToken = require('../middlewares/verifyToken');
const authorize = require('../middlewares/authorize');

// Controllers
const registerUser = require('../controllers/users/registerUser');
const loginUser = require('../controllers/users/loginUser');
const verifyJWT = require('../controllers/users/verifyJWT');
const userProfile = require('../controllers/users/userProfile');
const getAllUsers = require('../controllers/users/getAllUsers');

// PUBLIC ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);

// PROTECTED ROUTES
router.get('/verify-token', verifyToken, verifyJWT);
router.get('/get-all-users', verifyToken, authorize(1), getAllUsers); // Admins only
router.get('/get-user-profile', verifyToken, userProfile);

module.exports = router;
