// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const questionnaireRouter = require('./routes/questionnaireRouter');
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes')
const sequelize = require('./config/database');
const chatbotRoutes = require('./routes/chatbotRoutes')
const app = express();
const port = 3001;

const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');

    await sequelize.sync({ alter: true }); 
    console.log('Database schema synchronized');

  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1); 
  }
};

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: 'my-secret-key', 
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/questionnaires', questionnaireRouter);
app.use('/auth', authRoutes); 
app.use('/api', userRoutes, chatbotRoutes); 

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const startServer = async () => {
  try {
    await initializeDatabase(); 
    
    app.listen(port, () => {
      console.log(`
      ========================================
       Server is running on port ${port}
       Database: ${sequelize.config.database}
       Environment: ${process.env.NODE_ENV || 'development'}
      ========================================
      `);
    });
    
  } catch (error) {
    console.error('Server startup failed:', error);
    process.exit(1);
  }
};
startServer();