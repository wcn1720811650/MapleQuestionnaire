import { Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material';

function SingleChoiceRender({ question }) {
  return (
    <FormControl component="fieldset">
      <RadioGroup>
        {question.options.map((opt) => (
          <FormControlLabel
            key={opt.id}
            value={opt.text}
            control={<Radio />}
            label={opt.text || '(Empty option)'}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}

export default SingleChoiceRender;
