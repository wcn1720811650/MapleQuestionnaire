const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    googleId: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: [2, 50],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM('user', 'manager'),
      defaultValue: 'user',
    },
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: (user) => {
        console.log('Creating user:', user.email);
      },
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Questionnaire, {
      foreignKey: 'userId',
      as: 'questionnaires',
      constraints: false, 
    });
  };

  User.findByGoogleId = async (googleId) => {
    return await User.findOne({ where: { googleId } });
  };

  User.findById = async (id) => {
    return await User.findByPk(id);
  };

  return User;
};