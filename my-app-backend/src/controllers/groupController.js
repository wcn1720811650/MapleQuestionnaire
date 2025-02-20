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

exports.getGroupCustomers = async (req, res) => {
  try {
    const groupId = parseInt(req.params.id);

    const group = await db.Group.findByPk(groupId, {
      include: [
        {
          model: db.Customer,
          as: 'customers',
          include: [{ model: db.User, as: 'customerInfo' }], 
        },
      ],
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.status(200).json({
      group: {
        id: group.id,
        name: group.name,
        customers: group.customers.map((c) => ({
          id: c.id,
          name: c.customerInfo?.name || 'Unknown',
          email: c.customerInfo?.email || 'Unknown',
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching group customers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};