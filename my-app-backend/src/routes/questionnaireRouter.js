// src/routes/questionnaireRouter.js
const express = require('express');
const {
  getAllQuestionnaires,
  createQuestionnaire,
  getQuestionnaireById,
  updateQuestionnaire,
  deleteQuestionnaire
} = require('../controllers/questionnaireController');

const router = express.Router();


router.get('/', getAllQuestionnaires);            
router.post('/', createQuestionnaire);            
router.get('/:id', getQuestionnaireById);         
router.put('/:id', updateQuestionnaire);          
router.delete('/:id', deleteQuestionnaire);       

module.exports = router;
