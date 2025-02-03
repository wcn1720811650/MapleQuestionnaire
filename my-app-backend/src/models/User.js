// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  googleId: {
    type: DataTypes.STRING,
    unique: true
  },
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  avatar: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  role: {
    type: DataTypes.STRING,
    defaultValue: 'user'
  }
}, {
  timestamps: true, 
  hooks: {
    beforeCreate: (user) => {
      console.log('Creating user:', user.email);
    }
  }
});

User.findByGoogleId = async (googleId) => {
  return await User.findOne({ where: { googleId } });
};

User.findById = async (id) => {
  return await User.findByPk(id);
};

User.prototype.save = async function() {
  return this.save();
};

module.exports = User;