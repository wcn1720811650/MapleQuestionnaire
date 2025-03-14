// src/routes/questionnaireRouter.js
const express = require('express');
const {
  getAllQuestionnaires,
  createQuestionnaire,
  starQuestionnaire, 
  deleteQuestionnaire, 
  restoreQuestionnaire, 
  deleteForever,
  updatePublicStatus,
  publishQuestionnaire,
  getUserQuestionnaires,
  getQuestionnaireById,
  submitAnswers,
  getSubmissionStatus,
  getUserAnswers
} = require('../controllers/questionnaireController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/', getAllQuestionnaires);            
router.post('/', createQuestionnaire);           
router.post('/:id/star', starQuestionnaire);
router.post('/:id/delete', deleteQuestionnaire);
router.post('/:id/restore', restoreQuestionnaire);
router.delete('/:id', deleteForever);
router.post('/:id/public', updatePublicStatus);
router.post('/publish',authMiddleware, publishQuestionnaire);
router.get('/user-questionnaires', getUserQuestionnaires);
router.get('/', getAllQuestionnaires);            
router.get('/:id', getQuestionnaireById);            
router.post('/:id/submit', authMiddleware, submitAnswers);
router.get('/:id/submission-status', authMiddleware, getSubmissionStatus);
router.get('/:id/submitted-answers',authMiddleware,getUserAnswers);

module.exports = router;
