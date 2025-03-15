// models/questionnaire-access.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const QuestionnaireAccess = sequelize.define('QuestionnaireAccess', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      questionnaireId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE, 
        allowNull: true,
      },
      isSubmitted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    }, {
      tableName: 'questionnaire_access',
      timestamps: true,
    });
  
    QuestionnaireAccess.associate = (models) => {
      QuestionnaireAccess.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
  
      QuestionnaireAccess.belongsTo(models.Questionnaire, {
        foreignKey: 'questionnaireId',
        as: 'questionnaire',
      });
    };
  
    return QuestionnaireAccess;
  };