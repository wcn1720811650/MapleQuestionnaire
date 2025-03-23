// controllers/consultantController.js
const db = require('../models');
const { Op } = require('sequelize');
exports.getGroupSubmissions = async (req, res) => {
  const consultantId = req.user.id;

  try {
    const groups = await db.Group.findAll({
      where: { userId: consultantId },
      include: [{
        model: db.Customer,
        as: 'customers',
        through: { attributes: [] },
        include: [{
          model: db.User,
          as: 'customerInfo',
          attributes: ['name']
        }]
      }]
    });    

    const result = await Promise.all(groups.map(async (group) => {
      const submissions = await db.UserAnswer.findAll({
        where: {
          userId: {
            [Op.in]: group.customers.map(c => c.customerId)
          }
        },
        include: [{
          model: db.Questionnaire,
          as: 'questionnaire',
          attributes: ['id', 'title'],
          required: true
        }],
        attributes: ['questionnaireId', 'userId', 'createdAt']
      });

      
      return {
        groupId: group.id,
        groupName: group.name,
        members: group.customers.map(customer => ({
          userId: customer.customerId,
          userName: customer.customerInfo?.name,
          submissions: submissions
            .filter(s => s.userId === customer.customerId && s.questionnaire)
            .map(s => ({
              questionnaireId: s.questionnaire.id,
              title: s.questionnaire.title, 
              submittedAt: s.createdAt
            }))
        }))
      };
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Failed to obtain submission data:', error);
    res.status(500).json({ error: 'Failed to obtain data' });
  }
};

exports.getSubmissionDetails = async (req, res) => {
    const { userId, questionnaireId } = req.params;
    console.log(userId);
    
    const consultantId = req.user.id; 
    const customers = await db.Customer.findOne({
      where:{customerId: userId},
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
    try {
      const validAccess = await db.Group.findOne({
        where: { userId: consultantId }, 
        include: [{
          model: db.Customer,
          as: 'customers',
          where: { id: customers.id },
          required: true,
          through: { attributes: [] },
          include: [{ 
            model: db.User,
            as: 'customerInfo',
            attributes: ['name', 'email']
          }]
        }]
      });

      const questionnaire = await db.Questionnaire.findByPk(questionnaireId, {
        attributes: ['id', 'title', 'questions', 'userId'],
      });
      const userInfo = validAccess?.customers?.[0]?.customerInfo || {};
      
      if (!questionnaire?.questions) {
        console.error('[DATA] Invalid questionnaire data', {
          exists: !!questionnaire,
          hasQuestions: !!questionnaire?.questions
        });
        return res.status(400).json({
          success: false,
          error: 'Questionnaire data is incomplete',
          questionnaireId
        });
      }

      let questions;
      try {
        questions = Array.isArray(questionnaire.questions) 
          ? questionnaire.questions
          : JSON.parse(questionnaire.questions);
          
        if (!Array.isArray(questions)) {
          throw new Error('The data format is abnormal.');
        }
      } catch (e) {
        console.error('[PARSE ERROR]', {
          rawData: questionnaire.questions,
          error: e.message
        });
        return res.status(500).json({
          success: false,
          error: 'Questionnaire data parsing failed',
          details: process.env.NODE_ENV === 'development' ? {
            message: e.message,
            rawData: questionnaire.questions
          } : null
        });
      }
  
      const answers = await db.UserAnswer.findAll({
        where: { userId, questionnaireId },
        attributes: ['questionId', 'answer', 'createdAt'],
        order: [['createdAt', 'DESC']]
      });
  
      const normalizedQuestions = questions.map((q, index) => ({
        id: q.id || `temp_${index}_${Date.now()}`,
        text: q.text || 'Unnamed question',
        type: q.type || 'text',
        options: q.type !== 'text' 
          ? (q.options || []).map(opt => ({
              id: opt.id || `opt_${index}_${Date.now()}`,
              value: opt.value || opt.text || 'default value',
              text: opt.text || 'Unnamed option'
            }))
          : undefined
      }));
  
      const formattedAnswers = answers.reduce((acc, curr) => {
        try {
          acc[curr.questionId] = {
            value: JSON.parse(curr.answer),
            submittedAt: curr.createdAt
          };
        } catch (e) {
          console.warn(`[WARN] Answer parsing failed questionId:${curr.questionId}`, curr.answer);
          acc[curr.questionId] = {
            error: 'Invalid answer format',
            rawAnswer: curr.answer,
            submittedAt: curr.createdAt
          };
        }
        return acc;
      }, {});
  
      const response = {
          success: true,
          data: {
              questionnaire: {
                  id: questionnaire.id,
                  title: questionnaire.title,
                  questions: normalizedQuestions,
                  createdBy: questionnaire.userId,
                  createdAt: questionnaire.createdAt
              },
              answers: formattedAnswers,
              user: {
                  id: userId,
                  name: userInfo.name || 'Unknown user',
                  email: userInfo.email || ''
              },
              meta: {
                  lastUpdated: new Date().toISOString(),
                  questionCount: normalizedQuestions.length
              }
          }
      };
  
      return res.json(response);
  
    } catch (error) {
      console.error('[ERROR] Failed to obtain submission details:', {
        userId,
        questionnaireId,
        error: error.message,
        stack: error.stack
      });
      
      return res.status(500).json({
        success: false,
        error: 'Data loading failed',
        details: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : null
      });
    }
  };

exports.createSuggestion = async (req, res) => {
  try {
    const { userId, questionnaireId } = req.params;
    const { suggestion } = req.body;
    const consultantId = req.user.id;
    const customers = await db.Customer.findOne({
      where:{customerId: userId},
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
    const validAccess = await db.Group.findOne({
      where: { userId: consultantId },
      include: [{
        model: db.Customer,
        as: 'customers',
        where: { id: customers.id },
        required: true,
        through: { attributes: [] }
      }]
    });

    if (!validAccess) {
      return res.status(403).json({ 
        success: false,
        error: 'No permission to submit suggestions'
      });
    }

    const questionnaireExists = await db.Questionnaire.findOne({
      where: { id: questionnaireId }
    });

    if (!questionnaireExists) {
      return res.status(404).json({
        success: false,
        error: 'Questionnaire not found'
      });
    }

    const newSuggestion = await db.Suggestion.create({
      content: suggestion,
      userId,
      questionnaireId,
      consultantId
    });

    res.status(201).json({
      success: true,
      data: {
        id: newSuggestion.id,
        content: newSuggestion.content,
        createdAt: newSuggestion.createdAt
      }
    });

  } catch (error) {
    console.error('[ERROR] Failed to create suggestion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save treatment suggestion'
    });
  }
};

exports.getSuggestions = async (req, res) => {
  try {
    const userId = req.user.id; 

    const suggestions = await db.Suggestion.findAll({
      where: { userId }, 
      include: [
        {
          model: db.Questionnaire,
          attributes: ['title']
        },
        {
          model: db.User,
          as: 'consultant',
          attributes: ['name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: suggestions.map(s => ({
        id: s.id,
        content: s.content,
        createdAt: s.createdAt,
        questionnaire: s.Questionnaire.title,
        consultant: s.consultant.name
      }))
    });
  } catch (error) {
    console.error('[ERROR] Failed to get suggestions:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to retrieve suggestions',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

exports.getConsultantSuggestions = async (req, res) => {
  const consultantId = req.user.id;

  try {
    const suggestions = await db.Suggestion.findAll({
      where: { consultantId },
      include: [
        {
          model: db.Questionnaire,
          attributes: ['id', 'title']
        },
        {
          model: db.User,
          as: 'customer',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: suggestions.map(s => ({
        id: s.id,
        content: s.content,
        createdAt: s.createdAt,
        questionnaire: {
          id: s.Questionnaire.id,
          title: s.Questionnaire.title
        },
        user: {
          id: s.customer.id,
          name: s.customer.name
        }
      }))
    });

  } catch (error) {
    console.error('[ERROR] Failed to get consultant suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve suggestions',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};