// MultipleChoiceRender.jsx
import React from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function MultipleChoiceRender({ question, onAnswer,isReadOnly }) {
  const selectedTexts = new Set(
    Array.isArray(question.answer) 
      ? question.answer 
      : []
  );

  const handleChange = (optionText) => {
    const newSelected = new Set(selectedTexts);
    
    newSelected.has(optionText) 
      ? newSelected.delete(optionText)
      : newSelected.add(optionText);

    onAnswer(question.id, Array.from(newSelected));
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
                checked={selectedTexts.has(option.text)}
                onChange={() => handleChange(option.text)}
                disabled={isReadOnly}
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