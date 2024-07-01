const express = require('express');
const router = express.Router();

// Middleware
const verifyToken = require('../middlewares/verifyToken');
// const authorize = require('../middlewares/authorize');

// Controllers
const fetchCountAvailableWorkItems = require('../controllers/statistics/fetchCountAvailableWorkItems');


// PROTECTED ROUTES
router.get('/available-work-items-count', verifyToken, fetchCountAvailableWorkItems);

// router.post('/team-details', verifyToken, requestAccess);

module.exports = router;
