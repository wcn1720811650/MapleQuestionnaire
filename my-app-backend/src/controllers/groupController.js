const { Op } = require('sequelize');
const db = require('../models');

exports.createGroup = async (req, res) => {
  try {
    const { name, customerIds } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'Group name is required and must be a non-empty string' });
    }
    if (!Array.isArray(customerIds) || customerIds.length === 0) {
      return res.status(400).json({ error: 'At least one customer ID is required' });
    }

    const customers = await db.Customer.findAll({
      
    });

    if (customers.length !== customerIds.length) {
      return res.status(400).json({ error: 'One or more customers do not exist or do not belong to you' });
    }

    const group = await db.Group.create({
      name,
      userId: req.user.id, 
    });

    await group.addCustomers(customers);

    res.status(201).json({
      message: 'Group created successfully',
      group: {
        id: group.id,
        name: group.name,
        customers: customers.map((c) => ({ id: c.id, name: c.customerInfo?.name || 'Unknown', })),
      },
    });
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const userId = req.user.id; 

    const groups = await db.Group.findAll({
      where: { userId }, 
      include: [
        {
          model: db.Customer,
          as: 'customers',
          include: [{ model: db.User, as: 'customerInfo' }], 
        },
      ],
    });

    res.status(200).json({
      total: groups.length,
      groups: groups.map((group) => ({
        id: group.id,
        name: group.name,
        customers: group.customers.map((c) => ({
          id: c.id,
          name: c.customerInfo?.name || 'Unknown',
          email: c.customerInfo?.email || 'No email available'
        })),
      })),
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const groupId = parseInt(req.params.id); 
    const userId = req.user.id; 

    const group = await db.Group.findOne({
      where: { id: groupId, userId }, 
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found or you do not have permission to delete it' });
    }

    await group.destroy();

    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.removeCustomer = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { customerIds } = req.body;

    const group = await db.Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.removeCustomers(customerIds);

    res.status(200).json({ message: 'Customers removed successfully' });
  } catch (error) {
    console.error('Error removing customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

