const express = require('express');
const { googleLogin, googleCallback, loginSuccess, getProfile } = require('../controllers/authController');

const router = express.Router();

router.get('/google', googleLogin);

router.get('/google/callback', googleCallback, loginSuccess);

router.get('/profile', getProfile);

module.exports = router;