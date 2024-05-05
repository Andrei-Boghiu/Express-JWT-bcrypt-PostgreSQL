const express = require('express');
const usersController = require('../controllers/usersController');
const auth = require('../middlewares/auth');

const router = express.Router();

router.post('/register', usersController.registerUser);
router.post('/login', usersController.loginUser);
router.get('/profile', auth, usersController.getUserProfile);

module.exports = router;
