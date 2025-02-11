import { FormControlLabel, Checkbox, Box } from '@mui/material';

function MultipleChoiceRender({ question }) {
  return (
    <Box>
      {question.options.map((opt) => (
        <FormControlLabel
          key={opt.id}
          control={<Checkbox />}
          label={opt.text || '(Empty option)'}
        />
      ))}
    </Box>
  );
}

export default MultipleChoiceRender;
