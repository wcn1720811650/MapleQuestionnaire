// src/models/index.js
const User = require('./User');
const Message = require('./Message');

User.hasMany(Message);
Message.belongsTo(User);

module.exports = {
    User,
    Message
  };