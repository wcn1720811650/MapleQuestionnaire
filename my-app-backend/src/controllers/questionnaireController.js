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
      isPublic: false,
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
    const questionnaire = await db.Questionnaire.findByPk(id);

    if (!questionnaire) {
      return res.status(404).json({ error: 'Questionnaire not found' });
    }

    questionnaire.isPublic = !questionnaire.isPublic;
    await questionnaire.save();

    res.status(200).json({
      message:'Public status updated successfully',
      data: { id: questionnaire.id, isPublic: questionnaire.isPublic },
    });
  } catch (error) {
    console.error('Error updating public status', error);
    res.status(500).json({ error: 'Failed to update public status', details: error.message });
  }
}

exports.publishQuestionnaire = async (req, res) => {
  const { questionnaireId, groupIds } = req.body;
  const userId = req.user.id; 

  try {
    const questionnaire = await db.Questionnaire.findByPk(questionnaireId, {
      where: { userId }, 
      include: [{ model: db.User, as: 'creator' }], 
    });
    if (!questionnaire) {
      return res.status(403).json({ error: 'No permission to operate this questionnaire' });
    }

    const validGroups = await db.Group.findAll({
      where: { id: groupIds, userId }, 
      include: [ 
        {
          model: db.Customer,
          as: 'customers', 
          through: db.GroupCustomer,
          attributes: ['id','customerId'], 
        },
      ],
    });    
    
    const memberUserIds = validGroups.flatMap(group =>
      group.customers?.map(customer => customer.customerId) || []
    );
    
    const uniqueMembers = Array.from(new Set(memberUserIds));
    
    if (uniqueMembers.length === 0) {
      return res.status(400).json({ error: 'There are no valid members in the selected group' });
    }

    await db.sequelize.transaction(async (t) => {
      await db.QuestionnaireAccess.destroy({
        where: { questionnaireId },
        transaction: t,
      });

      const accessRecords = uniqueMembers.map(userId => ({
        userId,
        questionnaireId,
        expiresAt: null,
      }));
      console.log(accessRecords);
      

      await db.QuestionnaireAccess.bulkCreate(accessRecords, { transaction: t });
    });
    
    res.status(201).json({
      success: true,
      message: 'Questionnaire published successfully',
      data: {
        questionnaireId,
        publishedTo: validGroups.map(g => ({
          groupId: g.id,
          groupName: g.name,
          memberCount: g.customers.length,
        })),
        totalMembers: uniqueMembers.length,
      },
    });
  } catch (error) {
    console.error('Publishing failed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserQuestionnaires = async (req, res) => {
  const userId = req.user.id;
  try {
    const questionnaires = await db.Questionnaire.findAll({
      include: [ 
        {
          model: db.QuestionnaireAccess,
          as:'accesses',
          where: { userId }, 
          required: true 
        }
      ],
    });
    res.status(200).json(questionnaires);
  } catch (error) {
    res.status(500).json({ error: 'Failed to obtain questionnaire' });
  }
};

exports.getQuestionnaireById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const questionnaire = await db.Questionnaire.findByPk(id, {
      include: [
        {
          model: db.QuestionnaireAccess,
          as:'accesses',
          where: { userId },
          required: true, 
        },
      ],
      attributes: { exclude: ['isDeleted', 'isPublic'] }, 
    });

    if (!questionnaire) {
      return res.status(403).json({ error: 'No access to this questionnaire' });
    }

    res.status(200).json(questionnaire);
  } catch (error) {
    res.status(500).json({ error: 'Failed to obtain questionnaire' });
  }
};


exports.submitAnswers = async (req, res) => {
  const questionnaireId = req.params.id; 
  const { answers } = req.body;
  
  const id = req.user.id;
  const customers = await db.Customer.findOne({
    where:{customerId: id},
    attributes: ['id', 'ownerId', 'customerId'],
    include: [
      {
        model: db.User,
        as: 'customerInfo',
        attributes: ['id', 'name']
      }
    ],
    raw: true 
  });
  
  const userId = customers.customerId; 
  
  try {
    const questionnaire = await db.Questionnaire.findByPk(questionnaireId, {
      include: [{
        model: db.QuestionnaireAccess,
        as:'accesses',
        where: { userId },
        required: true
      }],
      attributes: { exclude: ['isDeleted', 'isPublic'] },
    });
    

    if (!questionnaire) {
      return res.status(403).json({ error: 'You are not authorized to submit this questionnaire' });
    }

    const userAnswers = Object.entries(answers).map(([questionIdStr, answer]) => ({
      questionnaireId,
      questionId:parseInt(questionIdStr),
      userId,
      answer: JSON.stringify(answer),
    }));

    await db.sequelize.transaction(async (t) => {
      await db.UserAnswer.bulkCreate(userAnswers, { transaction: t });
      await db.QuestionnaireAccess.update(
        { isSubmitted: true },
        { where: { userId, questionnaireId }, transaction: t }
      );
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to submit answer:', error);
    res.status(500).json({ error: 'Submission failed' });
  }
};

exports.getSubmissionStatus = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const access = await db.QuestionnaireAccess.findOne({
      where: {
        questionnaireId: id,
        userId
      },
      attributes: ['isSubmitted']
    });

    if (!access) {
      return res.status(404).json({ error: 'Access record not found' });
    }

    res.status(200).json({
      questionnaireId: id,
      isSubmitted: access.isSubmitted
    });
  } catch (error) {
    console.error('Error fetching submission status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserAnswers = async (req, res) => {
  const { id: questionnaireId } = req.params;
  const userId = req.user.id;

  try {
    const answers = await db.UserAnswer.findAll({
      where: {
        questionnaireId,
        userId
      },
      attributes: ['questionId', 'answer']
    });

    const formattedAnswers = answers.reduce((acc, curr) => {
      acc[curr.questionId] = JSON.parse(curr.answer);
      return acc;
    }, {});

    res.status(200).json({
      questionnaireId,
      answers: formattedAnswers
    });
  } catch (error) {
    console.error('Error fetching user answers:', error);
    res.status(500).json({ error: 'Failed to get user answers' });
  }
};