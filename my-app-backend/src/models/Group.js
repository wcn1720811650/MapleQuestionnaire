const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Group = sequelize.define(
    'Group',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'groups',
      timestamps: true,
    }
  );

  Group.associate = (models) => {
    Group.belongsToMany(models.Customer, {
      through: models.GroupCustomer, 
      as: 'customers',
      foreignKey: 'groupId',
      otherKey: 'customerId',
    });
    Group.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'owner',
    });
    
  };

  return Group;
};