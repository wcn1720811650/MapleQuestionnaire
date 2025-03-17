// src/routes/consultantRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getGroupSubmissions,
  getSubmissionDetails
  
} = require('../controllers/consultantController');

const router = express.Router();

router.get('/',authMiddleware,getGroupSubmissions);
router.get('/:userId/:questionnaireId',authMiddleware,getSubmissionDetails);
module.exports = router;
