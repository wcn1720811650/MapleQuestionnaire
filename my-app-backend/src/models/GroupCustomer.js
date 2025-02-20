const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const GroupCustomer = sequelize.define(
    'GroupCustomer',
    {
      groupId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
    },
    {
      tableName: 'group_customers',
      timestamps: false,
    }
  );

  return GroupCustomer;
};