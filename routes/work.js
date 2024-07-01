const express = require('express');
const router = express.Router();

// Middleware
const verifyToken = require('../middlewares/verifyToken');
const authorize = require('../middlewares/authorize');

// Controllers
const addNewWorkItems = require('../controllers/work/allocation/addNewWorkItems');
const updateWorkItems = require('../controllers/work/allocation/updateWorkItems');
const addUpdateWorkItems = require('../controllers/work/allocation/addUpdateWorkItems');
const removeWorkItems = require('../controllers/work/allocation/removeWorkItems');
const truncateInflow = require('../controllers/work/allocation/truncateInflow');

const lobby = require('../controllers/work/distribution/userLobby');
const assignWorkItem = require('../controllers/work/distribution/assignWorkItem');

const transferWorkItem = require('../controllers/work/operations/transferWorkItem');
const updateStatus = require('../controllers/work/operations/updateStatus');

const availableItemsOverview = require('../controllers/work/overview/availableItemsOverview');

// ALLOCATION ROUTES
router.post('/allocation/add-new-items', verifyToken, authorize(4), addNewWorkItems);
router.post('/allocation/update-items', verifyToken, authorize(4), updateWorkItems);
router.post('/allocation/add-update-items', verifyToken, authorize(4), addUpdateWorkItems);
router.post('/allocation/remove-items', verifyToken, authorize(4), removeWorkItems);
router.get('/allocation/truncate-inflow', verifyToken, authorize(4), truncateInflow);

// DISTRIBUTION ROUTES
router.get('/distribution/user-lobby', verifyToken, authorize(5), lobby);
router.get('/distribution/get-item', verifyToken, authorize(5), assignWorkItem);

// OPERATIONS ROUTES
router.post('/operations/transfer-item', verifyToken, authorize(5), transferWorkItem);
router.post('/operations/update-status', verifyToken, authorize(5), updateStatus);

// OVERVIEW
router.get('/overview/ingestion', verifyToken, authorize(4), availableItemsOverview);


module.exports = router;