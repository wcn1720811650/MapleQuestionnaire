// MultipleChoiceRender.jsx
import React from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';

export default function MultipleChoiceRender({ question, onAnswer }) {
  // 使用文本作为选中值
  const selectedTexts = new Set(
    Array.isArray(question.answer) 
      ? question.answer 
      : []
  );

  const handleChange = (optionText) => {
    const newSelected = new Set(selectedTexts);
    
    // 切换文本选中状态
    newSelected.has(optionText) 
      ? newSelected.delete(optionText)
      : newSelected.add(optionText);

    // 直接传递文本数组
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