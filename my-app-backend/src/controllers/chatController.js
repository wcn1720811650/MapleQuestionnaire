// src/controllers/chatController.js
const axios = require('axios');
const { Message } = require('../models'); 
const db = require('../models');

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

exports.handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (userId) {
        await Message.create({
          content: message,
          sender: 'user',
          UserId: userId,
        });
      }

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const botResponse = response.data.choices[0].message.content;
    await Message.create({
      content: botResponse,
      sender: 'bot',
      UserId: userId
    });

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Chat error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      res.status(500).json({ error: 'Failed to process chat message' });
    }
};

exports.generatePsychologicalAdvice = async (req, res) => {
  try {
    const { userAnswerId } = req.params;
    const userId = req.user.id;

    // Check for existing advice
    const existingAdvice = await db.PsychologicalAdvice.findOne({
      where: { userAnswerId, userId }
    });
    
    if (existingAdvice) {
      return res.json({ 
        success: true,
        data: { advice: existingAdvice.content },
        message: 'Existing advice retrieved'
      });
    }

    // Get user answer with questionnaire info
    const userAnswer = await db.UserAnswer.findOne({
      where: { id: userAnswerId, userId },
      include: [{
        model: db.Questionnaire,
        as: 'questionnaire',
        attributes: ['id', 'title', 'questions']
      }]
    });

    if (!userAnswer) {
      return res.status(404).json({ 
        success: false,
        error: 'User answer not found' 
      });
    }

    // Get all answers for this questionnaire
    const allAnswers = await db.UserAnswer.findAll({
      where: { 
        userId,
        questionnaireId: userAnswer.questionnaireId 
      },
      order: [['createdAt', 'ASC']]
    });

    // Parse questions
    let questions = [];
    try {
      questions = typeof userAnswer.questionnaire.questions === 'string' 
        ? JSON.parse(userAnswer.questionnaire.questions)
        : userAnswer.questionnaire.questions;
    } catch (e) {
      console.error('Failed to parse questions:', e);
    }

    // Build Q&A pairs
    const qaPairs = allAnswers.map(answer => {
      const question = questions.find(q => q.id === answer.questionId) || 
                     { id: answer.questionId, text: 'Unknown question' };
      return {
        question: question.text,
        answer: answer.answer
      };
    });

    // Generate AI prompt
    const prompt = `As a professional psychologist, please provide advice based on:
    
Questionnaire: ${userAnswer.questionnaire.title}
Responses:
${JSON.stringify(qaPairs, null, 2)}

Provide empathetic, professional advice. Conclude with "MapleAI".`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { 
            role: "system", 
            content: "You are a psychologist. Provide gentle, professional advice. Sign as 'MapleAI'." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000  
      }
    );

    const advice = response.data.choices[0].message.content;

    // Save new advice
    await db.PsychologicalAdvice.create({
      userId,
      userAnswerId,
      content: advice
    });

    res.json({ 
      success: true,
      data: { advice },
      message: 'Advice generated successfully'
    });

  } catch (error) {
    console.error('Advice generation failed:', {
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate advice',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};