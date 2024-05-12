const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const authorize = require('../middlewares/authorize');
const router = express.Router();

// PROTECTED ROUTES
router.get('/teams', verifyToken);

module.exports = router;
