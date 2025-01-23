import { FormControlLabel, Checkbox, Box } from '@mui/material';

function MultipleChoiceRender({ question }) {
  return (
    <Box>
      {question.options.map((opt) => (
        <FormControlLabel
          key={opt.id}
          control={<Checkbox />}
          label={opt.text || '(Empty option)'}
          // 同理, value={opt.text} 如果需要收集选中状态
        />
      ))}
    </Box>
  );
}

export default MultipleChoiceRender;
