// src/controllers/questionnaireController.js
const e = require('express');
const { questionnaires } = require('../data/inMemoryData');
const { v4: uuidv4} = require('uuid')
/**
 * get all questionnaires
 * @param {*} req 
 * @param {*} res 
 */
function getAllQuestionnaires(req, res) {


  return res.json(questionnaires);
}


function createQuestionnaire(req, res) {
  const { title, questions } = req.body;
  if (!title || typeof title!=='string' || title.trim() === '') {
    return res.status(400).json({ error: 'title is required and must be a non-empty string' });
  }
  if (!Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ error: 'questions is required and must be a non-empty array'})
  }

  for (const question of questions) {
    if (!question.question || typeof question.question !== 'string' || question.question.trim() === '') {
      return res.status(400).json({ error: 'Each question must have a non-empty "question" field' });
    }
    if (!question.type || typeof question.type !== 'string') {
      return res.status(400).json({ error: 'Each question must have a "type" field' });
    }
  }

  const newQ = {
    id: uuidv4(),
    title,
    questions,
    isStarred: false,
    isDeleted: false,
  };
  questionnaires.push(newQ);

  return res.status(201).json(newQ);
}


function getQuestionnaireById(req, res) {
  const { id } = req.params;
  const found = questionnaires.find(q => String(q.id) === id);
  if (!found) {
    const error = new Error('Questionnaire not found');
    error.status = 404;
    throw error;
  }
  return res.json(found);
}


function updateQuestionnaire(req, res) {
  const { id } = req.params;
  const { title, questions, isStarred, isDeleted } = req.body;

  const index = questionnaires.findIndex(q => String(q.id) === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Questionnaire not found' });
  }

  const updated = {
    ...questionnaires[index],
    ...(title !== undefined && { title }),
    ...(questions !== undefined && { questions }),
    ...(isStarred !== undefined && { isStarred }),
    ...(isDeleted !== undefined && { isDeleted }),
  };

  questionnaires[index] = updated;
  return res.json(updated);
}


function deleteQuestionnaire(req, res) {
  const { id } = req.params;
  const before = questionnaires.length;
  const after = questionnaires.filter(q => String(q.id) !== id);
  if (after.length === before) {
    return res.status(404).json({ error: 'Questionnaire not found' });
  }
  questionnaires.length = 0;
  questionnaires.push(...after);

  return res.json({ message: 'Deleted permanently' });
}

module.exports = {
  getAllQuestionnaires,
  createQuestionnaire,
  getQuestionnaireById,
  updateQuestionnaire,
  deleteQuestionnaire,
};
