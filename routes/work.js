const express = require('express');
const verifyToken = require('../middlewares/auth');
const { inProgress } = require('../controllers/workController');

const router = express.Router();

// PROTECTED ROUTES
router.get('/in-progress', verifyToken, inProgress);

module.exports = router;
