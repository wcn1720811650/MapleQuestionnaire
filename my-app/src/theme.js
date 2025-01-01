// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6BA17C', 
    },
    secondary: {
      main: '#4B9B4B', 
    },
    background: {
      default: '#F3F8F3', 
      paper: '#FFFFFF',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
  },
  typography: {
    fontFamily: ['"Open Sans"', 'Microsoft YaHei', 'sans-serif'].join(','),
    
  },
});

export default theme;
