const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'customers',
    timestamps: true,
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.User, {
      foreignKey: 'customerId',
      as: 'customerInfo',
      constraints: true, 
    });

    Customer.belongsTo(models.User, {
      foreignKey: 'ownerId', 
      as: 'owner'
    });

    Customer.belongsToMany(models.Group, {
      through: models.GroupCustomer, 
      as: 'groups', 
      foreignKey: 'customerId',
    });
    Customer.hasMany(models.UserAnswer, {
      as: 'answers',
      foreignKey: 'customerId' 
    });
  };

  return Customer;
};