// src/routes/consultantRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  getGroupSubmissions,
  getSubmissionDetails,
  createSuggestion
  
} = require('../controllers/consultantController');

const router = express.Router();

router.get('/',authMiddleware,getGroupSubmissions);
router.get('/submissions/:userId/:questionnaireId',authMiddleware,getSubmissionDetails);
router.get('/:userId/:questionnaireId',authMiddleware,getSubmissionDetails);
router.post('/submissions/:userId/:questionnaireId/suggestions', authMiddleware, createSuggestion);
module.exports = router;
