const express = require('express');
const router = express.Router();

// Middleware
const verifyToken = require('../middlewares/verifyToken');
const authorize = require('../middlewares/authorize');

// Controllers
const availableTeamsToJoin = require('../controllers/teams/availableTeamsToJoin');
const requestAccess = require('../controllers/teams/requestAccess');
const teamsJoinedByUser = require('../controllers/teams/teamsJoinedByUser');


// PROTECTED ROUTES
router.get('/available-to-join', verifyToken, availableTeamsToJoin);
router.get('/check-user-teams', verifyToken, teamsJoinedByUser);

router.post('/request-access', verifyToken, requestAccess);
// router.post('/team-details', verifyToken, requestAccess);



module.exports = router;
