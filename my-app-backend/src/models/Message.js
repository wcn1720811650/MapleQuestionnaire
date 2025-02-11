const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sender: {
      type: DataTypes.ENUM('user', 'bot'),
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false, 
    },
  }, {
    tableName: 'messages',
    timestamps: true,
  });

  Message.associate = (models) => {
    Message.belongsTo(models.User, {
      foreignKey: 'UserId',
      as: 'user',
      constraints: false, 
    });
  };

  return Message;
};