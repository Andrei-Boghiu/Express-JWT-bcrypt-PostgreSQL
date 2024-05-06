const express = require('express');
const verifyToken = require('../middlewares/auth');
const authorize = require('../middlewares/authorize');

const {
    getUserItems,
    adminAddItems,
    assignNewItem,
    unassignWorkItem,
} = require('../controllers/workController');

const router = express.Router();

// PROTECTED GET ROUTES
router.get('/get-user-items', verifyToken, getUserItems);
router.put('/assign-new-item', verifyToken, assignNewItem); //

// ADMIN PROTECTED GET ROUTES
router.get('/admin/data', verifyToken, authorize('admin'), (req, res) => {
    res.json({ adminData: 'Some sensitive data' });
});
router.get('/dashboard/stats', verifyToken, authorize(['admin', 'manager']), (req, res) => {
    res.json({ stats: 'Some stats' });
});

// ADMIN PROTECTED POST ROUTES
router.post('/admin/add-items', verifyToken, authorize('admin'), adminAddItems);

router.patch('/set-unassigned', verifyToken, authorize(['admin', 'manager']), unassignWorkItem);

// Both 'admin' and 'manager' roles can access this route

// Only 'admin' can access this routes:

router.patch('/set-completed', verifyToken, unassignWorkItem);

module.exports = router;
