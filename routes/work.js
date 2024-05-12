const express = require('express');
const router = express.Router();

// Middleware
const verifyToken = require('../middlewares/verifyToken');
const authorize = require('../middlewares/authorize');

// Controllers
const lobby = require('../controllers/work/lobby');
const insertWorkItems = require('../controllers/work/insertWorkItems');
const assignWorkItem = require('../controllers/work/assignWorkItem');
const unassignWorkItem = require('../controllers/work/unassignWorkItem');
const completeWorkItem = require('../controllers/work/completeWorkItem');

// to add middleware that verifies if the user really is from the team id received from the client.

// GET
router.get('/lobby', verifyToken, lobby);
router.get('/assign-new-item', verifyToken, assignWorkItem);

// ADMIN PROTECTED ROUTES
router.get('/admin/data', verifyToken, authorize('admin'), (req, res) => {
    res.json({ adminData: 'Some sensitive data' });
});
router.get('/dashboard/stats', verifyToken, authorize(['admin', 'manager']), (req, res) => {
    res.json({ stats: 'Some stats' });
});

router.post('/admin/add-items', verifyToken, authorize(4), insertWorkItems);

router.patch('/set-unassigned', verifyToken, authorize(1), unassignWorkItem);

router.patch('/set-completed', verifyToken, completeWorkItem);

module.exports = router;
