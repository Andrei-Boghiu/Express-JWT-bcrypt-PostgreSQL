const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const authorize = require('../middlewares/authorize');

const {
    getUserItems,
    adminAddItems,
    assignNewItem,
    unassignWorkItem,
    completeWorkItem,
} = require('../controllers/workController');

const router = express.Router();

// GET
// PROTECTED ROUTES
router.get('/get-user-items', verifyToken, getUserItems);
router.get('/assign-new-item', verifyToken, assignNewItem);

// ADMIN PROTECTED ROUTES
router.get('/admin/data', verifyToken, authorize('admin'), (req, res) => {
    res.json({ adminData: 'Some sensitive data' });
});
router.get('/dashboard/stats', verifyToken, authorize(['admin', 'manager']), (req, res) => {
    res.json({ stats: 'Some stats' });
});

// POST
// ADMIN PROTECTED ROUTES
router.post('/admin/add-items', verifyToken, authorize(4), adminAddItems);

// PATCH
// ADMIN PROTECTED ROUTES
router.patch('/set-unassigned', verifyToken, authorize(['admin', 'manager']), unassignWorkItem);

// PROTECTED ROUTES
router.patch('/set-completed', verifyToken, completeWorkItem);

module.exports = router;
