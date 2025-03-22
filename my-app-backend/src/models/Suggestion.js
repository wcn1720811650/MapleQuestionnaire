// models/Suggestion.js
const { DataTypes } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    const Suggestion = sequelize.define('Suggestion', {
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      questionnaireId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Questionnaires',
          key: 'id'
        }
      },
      consultantId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    }, {
      tableName: 'suggestions',
      timestamps: true
    });
  
    Suggestion.associate = (models) => {
      Suggestion.belongsTo(models.User, { 
        as: 'consultant',
        foreignKey: 'consultantId'
      });
      Suggestion.belongsTo(models.User, { 
        as: 'customer',
        foreignKey: 'userId'
      });
      Suggestion.belongsTo(models.Questionnaire, { 
        foreignKey: 'questionnaireId'
      });
    };
  
    return Suggestion;
  };