// src/server.js
const express = require('express');
const cors = require('cors');
const questionnaireRouter = require('./routes/questionnaireRouter');

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});
app.use('/api/questionnaires', questionnaireRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
