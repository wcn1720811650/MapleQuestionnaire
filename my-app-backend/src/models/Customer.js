// models/Customer.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Customer = sequelize.define('Customer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

Customer.belongsTo(User, { 
  foreignKey: 'customerId', 
  as: 'customerInfo',
  constraints: false 
});

module.exports = Customer;