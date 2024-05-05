const express = require('express');
const verifyToken = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const { inProgress } = require('../controllers/workController');

const router = express.Router();

// PROTECTED ROUTES
router.get('/in-progress', verifyToken, inProgress);

// Only 'admin' can access this route
router.get('/admin/data', verifyToken, authorize('admin'), (req, res) => {
    res.json({ adminData: 'Some sensitive data' });
});

// Both 'admin' and 'manager' roles can access this route
router.get('/dashboard/stats', verifyToken, authorize(['admin', 'manager']), (req, res) => {
    res.json({ stats: 'Some stats' });
});

module.exports = router;
