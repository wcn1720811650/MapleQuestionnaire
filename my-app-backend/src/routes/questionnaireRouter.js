// src/routes/questionnaireRouter.js
const express = require('express');
const {
  getAllQuestionnaires,
  createQuestionnaire,
  starQuestionnaire, 
  deleteQuestionnaire, 
  restoreQuestionnaire, 
  deleteForever,
  updatePublicStatus
} = require('../controllers/questionnaireController');

const router = express.Router();


router.get('/', getAllQuestionnaires);            
router.post('/', createQuestionnaire); // create questionnaire           
router.post('/:id/star', starQuestionnaire);
router.post('/:id/delete', deleteQuestionnaire);
router.post('/:id/restore', restoreQuestionnaire);
router.delete('/:id', deleteForever);
router.post('/:id/public', updatePublicStatus);

module.exports = router;
