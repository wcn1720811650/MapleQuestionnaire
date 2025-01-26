// src/controllers/questionnaireController.js
const { questionnaires } = require('../data/inMemoryData');

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
  if (!title || !questions) {
    return res.status(400).json({ error: 'title and questions are required' });
  }

  const newQ = {
    id: Date.now(),
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
    return res.status(404).json({ error: 'Questionnaire not found' });
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
