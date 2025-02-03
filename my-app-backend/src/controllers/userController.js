const User = require('../models/User');

module.exports = {
  async getUserInfo(req, res) {
    try {
      const user = User.findById(req.user.id);
      console.log('req.user:', req.user);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
        
      }
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  }
};