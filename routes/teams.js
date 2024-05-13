const express = require('express');
const router = express.Router();

// Middleware
const verifyToken = require('../middlewares/verifyToken');
const authorize = require('../middlewares/authorize');

// Controllers
const availableTeamsToJoin = require('../controllers/teams/availableTeamsToJoin');
const requestAccess = require('../controllers/teams/requestAccess');
const teamsJoinedByUser = require('../controllers/teams/teamsJoinedByUser');
const createNewTeam = require('../controllers/teams/createNewTeam');
const getAllTeams = require('../controllers/teams/getAllTeams');
const getMyTeams = require('../controllers/teams/getMyTeams');
const getMyTeam = require('../controllers/teams/getMyTeam');

// PROTECTED ROUTES
router.get('/available-to-join', verifyToken, availableTeamsToJoin);
router.get('/check-user-teams', verifyToken, teamsJoinedByUser);

router.get('/all-teams', verifyToken, authorize(1), getAllTeams);
router.get('/my-teams', verifyToken, getMyTeams);
router.post('/my-team', verifyToken, getMyTeam);

router.post('/request-access', verifyToken, requestAccess);
router.post('/create-new-team', verifyToken, createNewTeam);
// router.post('/team-details', verifyToken, requestAccess);



module.exports = router;
