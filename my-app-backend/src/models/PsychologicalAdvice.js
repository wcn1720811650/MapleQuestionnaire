const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const PsychologicalAdvice = sequelize.define('PsychologicalAdvice', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userAnswerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: 'psychological_advices',
    timestamps: true,
  });

  PsychologicalAdvice.associate = (models) => {
    PsychologicalAdvice.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    PsychologicalAdvice.belongsTo(models.UserAnswer, {
      foreignKey: 'userAnswerId',
      as: 'userAnswer',
    });
  };

  return PsychologicalAdvice;
};