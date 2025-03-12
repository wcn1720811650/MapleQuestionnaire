// SingleChoiceRender.jsx
import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

export default function SingleChoiceRender({ question, onAnswer }) {
  const handleChange = (e) => {
    const selectedId = e.target.value;
    onAnswer(question.id, selectedId); 

  };
  

  return (
    <FormControl fullWidth component="fieldset">
      <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500 }}>
        {question.text}
      </FormLabel>
      <RadioGroup
        value={question.answer || ''}
        onChange={handleChange}
      >
        {question.options.map((option) => (
          <FormControlLabel
            key={option.id}
            value={option.text}
            control={<Radio />}
            label={option.text}
            sx={{ '&:not(:last-child)': { mb: 1 } }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}