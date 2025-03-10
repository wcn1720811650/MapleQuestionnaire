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

  GroupCustomer.associate = (models) => {
    GroupCustomer.belongsTo(models.Group, {
      foreignKey: 'groupId',
      targetKey: 'id',
      as: 'group', 
    });

    GroupCustomer.belongsTo(models.Customer, {
      foreignKey: 'customerId',
      targetKey: 'id',
      as: 'customer',
    });
  };

  

  return GroupCustomer;
};