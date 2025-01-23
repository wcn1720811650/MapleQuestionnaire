import { TextField } from '@mui/material';

function TextRender({ question }) {
  return (
    <TextField
      variant="outlined"
      size="small"
      fullWidth
      placeholder="Fill in your answer..."
      // 如果要保存用户的填空内容，可加 onChange
    />
  );
}

export default TextRender;
