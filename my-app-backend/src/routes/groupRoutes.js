// src/routes/groupRouter.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const {
  createGroup,
  getGroups,
  deleteGroup
} = require('../controllers/groupController');

const router = express.Router();


router.post('/', authMiddleware, createGroup);;
router.get('/', authMiddleware, getGroups);;
router.delete('/:id', authMiddleware, deleteGroup);


module.exports = router;