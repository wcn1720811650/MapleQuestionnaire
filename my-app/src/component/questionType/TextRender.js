import { TextField } from '@mui/material';

function TextRender({ question }) {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      placeholder="Fill in your answer..."
    />
  );
}

export default TextRender;
