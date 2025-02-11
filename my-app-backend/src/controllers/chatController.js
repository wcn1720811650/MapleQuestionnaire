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