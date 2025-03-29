const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { handleChatMessage } = require('../controllers/chatController');
const { generatePsychologicalAdvice } = require('../controllers/chatController');
const { Message } = require('../models'); 
router.post('/chat', authMiddleware, handleChatMessage);
router.get('/AIadvice/:userAnswerId', authMiddleware, generatePsychologicalAdvice);
router.get('/messages', authMiddleware, async (req, res) => {
    try {
      const { page = 1, limit = 50, userId } = req.query;
      const whereClause = userId ? { UserId: userId } : {};
  
      const messages = await Message.findAndCountAll({
        where: whereClause,
        include: [{ model: User, attributes: ['id', 'email'] }], 
        order: [['createdAt', 'DESC']],
        offset: (page - 1) * limit,
        limit: Number(limit)
      });
  
      res.json({
        total: messages.count,
        data: messages.rows
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch messages' });
    }
  });

module.exports = router;
