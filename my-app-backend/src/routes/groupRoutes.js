// src/routes/groupRouter.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const {
  createGroup,
} = require('../controllers/groupController');

const router = express.Router();


router.post('/', authMiddleware, createGroup);;


module.exports = router;