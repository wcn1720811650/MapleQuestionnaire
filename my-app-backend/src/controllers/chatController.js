// src/controllers/chatController.js
const axios = require('axios');
const { Message } = require('../models'); 

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
      return res.status(404).json({ error: 'User answer not found' });
    }

    const prompt = `用户完成了一份心理测试问卷，请根据回答提供专业的心理建议。
问卷标题：${userAnswer.questionnaire.title}
用户回答：${JSON.stringify(userAnswer.answer)}
请以心理咨询师的身份，提供温和、专业且富有同理心的建议。`;

    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [
          { 
            role: "system", 
            content: "你是一位专业的心理咨询师，请以温和、专业且富有同理心的方式提供建议。注意倾听用户的感受，提供建设性的建议，并保持积极的态度。" 
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
        }
      }
    );

    const advice = response.data.choices[0].message.content;

    await db.PsychologicalAdvice.create({
      userId,
      userAnswerId,
      content: advice
    });

    res.json({ advice });
  } catch (error) {
    console.error('Generate advice error:', error);
    res.status(500).json({ error: 'Failed to generate psychological advice' });
  }
};