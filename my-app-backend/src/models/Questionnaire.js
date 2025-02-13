const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Questionnaire = sequelize.define('Questionnaire', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    isStarred: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    userId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    isPublic:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  }, {
    tableName: 'questionnaires',
    timestamps: true,
  });

  Questionnaire.associate = (models) => {
    Questionnaire.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'creator',
      constraints: false, 
    });
  };

  return Questionnaire;
};