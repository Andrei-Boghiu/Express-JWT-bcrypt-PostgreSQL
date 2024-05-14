const express = require('express');
const router = express.Router();

// Middleware
const verifyToken = require('../middlewares/verifyToken');
const authorize = require('../middlewares/authorize');

// Controllers
const availableTeamsToJoin = require('../controllers/teams/availableTeamsToJoin');
const requestAccess = require('../controllers/teams/requestAccess');
const teamsJoinedByUser = require('../controllers/teams/teamsJoinedByUser');
const requestCreateNewTeam = require('../controllers/teams/requestCreateNewTeam');
const getAllTeams = require('../controllers/teams/getAllTeams');
const getMyTeams = require('../controllers/teams/getMyTeams');
const getMyTeam = require('../controllers/teams/getMyTeam');
const approveNewMember = require('../controllers/teams/approveNewMember');
const approveNewTeam = require('../controllers/teams/approveNewTeam');

// PROTECTED ROUTES
router.get('/available-to-join', verifyToken, availableTeamsToJoin);
router.get('/check-user-teams', verifyToken, teamsJoinedByUser);

router.get('/all-teams', verifyToken, authorize(1), getAllTeams);
router.get('/my-teams', verifyToken, getMyTeams);


router.post('/request-access', verifyToken, requestAccess);
router.post('/request-create-new-team', verifyToken, authorize(3), requestCreateNewTeam);
router.post('/my-team', verifyToken, getMyTeam);
router.post('/approve-new-member', verifyToken, authorize(3), approveNewMember);
router.post('/approve-new-team', verifyToken, authorize(1), approveNewTeam);
// router.post('/team-details', verifyToken, requestAccess);

module.exports = router;