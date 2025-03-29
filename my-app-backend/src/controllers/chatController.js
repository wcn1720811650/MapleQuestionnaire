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
    
    const id = req.user.id;
    const customer = await db.Customer.findOne({
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
    const userId = customer.customerId;
  
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

    const userAnswer = await db.UserAnswer.findOne({
      where: { id: userAnswerId, userId },
      include: [
        { 
          model: db.Questionnaire,
          as: 'questionnaire',
          attributes: ['title']
        }
      ]
    });

    if (!userAnswer) {
      return res.status(404).json({ 
        success: false,
        error: 'User answer not found' 
      });
    }

    const prompt = `User completed a psychological questionnaire. Please provide professional advice.
Questionnaire Title: ${userAnswer.questionnaire.title}
User Answers: ${JSON.stringify(userAnswer.answer)}
Please provide gentle, professional and empathetic advice as a psychologist. 
Sign the advice as "MapleAI" at the end.`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { 
            role: "system", 
            content: "You are a professional psychologist. Provide advice in a gentle, professional and empathetic manner. Always sign your name as 'MapleAI' at the end of your advice." 
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

    await db.PsychologicalAdvice.create({
      userId,
      userAnswerId: userAnswerId,  
      content: advice
    });

    res.json({ 
      success: true,
      data: { advice },
      message: 'Advice generated successfully'
    });

  } catch (error) {
    console.error('Generate advice error:', {
      message: error.message,
      stack: error.stack,
      request: req.params
    });
    res.status(500).json({ 
      success: false,
      error: 'Failed to generate psychological advice',
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};