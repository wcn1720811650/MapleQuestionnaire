const db = require('../models');

exports.getAllQuestionnaires = async (req, res) => {
  try {
    const questionnaires = await db.Questionnaire.findAll();
    res.status(200).json(questionnaires);
  } catch (error) {
    console.error('Error fetching questionnaires:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createQuestionnaire = async (req, res) => {
  try {
    const { title, questions, userId } = req.body;

    if (!title || typeof title !== 'string') {
      return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Questions are required and must be a non-empty array' });
    }
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({ error: 'UserId is required and must be a number' });
    }
    const newQuestionnaire = await db.Questionnaire.create({
      title,
      questions,
      userId,
    });

    res.status(201).json({
      message: 'Questionnaire created successfully',
      questionnaire: newQuestionnaire,
    });
  } catch (error) {
    console.error('Error creating questionnaire:', error);
    res.status(500).json({ error: 'Failed to create questionnaire' });
  }
};

exports.starQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const questionnaire = await db.Questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    questionnaire.isStarred = !questionnaire.isStarred;
    await questionnaire.save();

    res.status(200).json({ message: 'Questionnaire starred successfully' });
  } catch (error) {
    console.error('Error starring questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const questionnaire = await db.Questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    questionnaire.isDeleted = true;
    await questionnaire.save();

    res.status(200).json({ message: 'Questionnaire deleted successfully' });
  } catch (error) {
    console.error('Error deleting questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.restoreQuestionnaire = async (req, res) => {
  try {
    const { id } = req.params;
    const questionnaire = await db.Questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    questionnaire.isDeleted = false;
    await questionnaire.save();

    res.status(200).json({ message: 'Questionnaire restored successfully' });
  } catch (error) {
    console.error('Error restoring questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteForever = async (req, res) => {
  try {
    const { id } = req.params;
    const questionnaire = await db.Questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    await questionnaire.destroy({ force: true });

    res.status(200).json({ message: 'Questionnaire permanently deleted successfully' });
  } catch (error) {
    console.error('Error permanently deleting questionnaire:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updatePublicStatus = async (req, res)=>{
  try {
    const { id } = req.params;
    const { isPublic } = req.body
    if (typeof isPublic !== 'boolean') {
      return res.status(400).json({ error: 'isPublick must be a boolean value' });
    }

    const questionnaire = await db.questionnaire.findByPk(id);
    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    questionnaire.isPublic = isPublic;
    await questionnaire.save();

    res.status(200).json({
      message:'Public status updated successfully',
      questionnaire,
    })
  } catch (error) {
    console.error('Error updating public status', error);
    res.status(500).json({ error: 'Failed to update public status' });
  }
}