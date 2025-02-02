// src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const questionnaireRouter = require('./routes/questionnaireRouter');
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes')

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.use(
  session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/questionnaires', questionnaireRouter);
app.use('/auth', authRoutes); 
app.use('/api', userRoutes); 


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});