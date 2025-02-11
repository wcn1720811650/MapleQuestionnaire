const db = require('../models');
const { Op } = require('sequelize');

module.exports = {
  async getUserInfo(req, res) {
    try {
      const user = await db.User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        phoneNumber: user.phoneNumber,
        role: user.role,
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Failed to fetch user info' });
    }
  },

  async getCustomerUsers(req, res) {
    try {
      const currentUser = req.user;

      const existingCustomers = await db.Customer.findAll({
        where: { ownerId: currentUser.id },
        attributes: ['customerId'],
      });

      const existingCustomerIds = existingCustomers.map((c) => c.customerId);

      const customers = await db.User.findAll({
        where: {
          id: {
            [Op.not]: currentUser.id,
            [Op.notIn]: existingCustomerIds,
          },
          role: 'user',
        },
      });

      res.json(customers);
    } catch (error) {
      console.error('Error fetching customer users:', error);
      res.status(500).json({ error: 'Failed to fetch customer users' });
    }
  },

  async addCustomer(req, res) {
    try {
      const { customerId } = req.body;
      const ownerId = req.user.id;
      if (!customerId) {
        return res.status(400).json({ error: 'Customer ID is required' });
      }

      const customer = await db.User.findByPk(customerId);
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      const owner = await db.User.findByPk(ownerId);
      if (!owner) {
        return res.status(404).json({ error: 'Owner not found' });
      }

      const existingCustomer = await db.Customer.findOne({
        where: { ownerId, customerId },
      });
      if (existingCustomer) {
        return res.status(400).json({ error: 'Customer already added' });
      }

      const newCustomer = await db.Customer.create({ ownerId, customerId });
      res.status(201).json({
        message: 'Customer added successfully',
        customer: {
          id: customer.id,
          name: customer.name,
          email: customer.email,
        },
      });
    } catch (error) {
      console.error('Error adding customer:', error);
      res.status(500).json({ error: 'Failed to add customer' });
    }
  },

  async getMyCustomers(req, res) {
    try {
      const ownerId = req.user.id;
      const customers = await db.Customer.findAll({
        where: { ownerId },
        include: [
          {
            model: db.User,
            as: 'customerInfo',
            attributes: ['id', 'name', 'email'],
          },
        ],
      });

      const customerList = customers.map((c) => ({
        id: c.customerInfo.id,
        name: c.customerInfo.name,
        email: c.customerInfo.email,
      }));

      res.json(customerList);
    } catch (error) {
      console.error('Error fetching my customers:', error);
      res.status(500).json({ error: 'Failed to fetch my customers' });
    }
  },

  async deleteCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const ownerId = req.user.id;
      const result = await db.Customer.destroy({
        where: {
          ownerId,
          customerId,
        },
      });

      if (result === 0) {
        return res.status(404).json({ error: 'Customer not found' });
      }

      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({ error: 'Failed to delete customer' });
    }
  },
};