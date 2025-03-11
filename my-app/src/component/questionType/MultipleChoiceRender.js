// MultipleChoiceRender.jsx
import React from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function MultipleChoiceRender({ question, onAnswer }) {
  const selectedValues = new Set(question.answer?.map(String) || []);

  const handleChange = (value) => {
    const newSet = new Set(selectedValues);
    const stringValue = String(value);
    
    newSet.has(stringValue) 
      ? newSet.delete(stringValue)
      : newSet.add(stringValue);

    onAnswer(question.id, Array.from(newSet)); 
  };

  return (
    <FormControl fullWidth component="fieldset">
      <FormLabel component="legend" sx={{ mb: 2, fontWeight: 500 }}>
        {question.text}
      </FormLabel>
      <FormGroup>
        {question.options.map((option) => (
          <FormControlLabel
            key={option.id}
            control={
              <Checkbox
                checked={selectedValues.has(String(option.value))}
                onChange={() => handleChange(option.value)}
              />
            }
            label={option.text}
            sx={{ '&:not(:last-child)': { mb: 1 } }}
          />
        ))}
      </FormGroup>
    </FormControl>
  );
}