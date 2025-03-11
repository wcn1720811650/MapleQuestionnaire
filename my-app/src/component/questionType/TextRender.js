import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

export default function TextRender({ question, onAnswer, isReadOnly }) {
  const [text, setText] = useState(question.answer || '');

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    onAnswer(question.id, value); 
  };

  return (
    <Box>
      <Typography variant="body1" sx={{ mb: 1 }}>
        {question.text}
      </Typography>
      <TextField
        value={text}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        placeholder="Please enter your answer..."
        disabled={isReadOnly}
        sx={{ mt: 1 }}
      />
    </Box>
  );
}