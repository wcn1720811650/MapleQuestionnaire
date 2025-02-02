import React from 'react';
import { useEffect } from 'react'; 
import {
  Box,
  Paper,
  Typography,
  Button,
  Link,
} from '@mui/material';

function LoginPage() {

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3001/auth/google'; 
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      window.location.href = '/questionnaire'; 
    }
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        height: '100vh',
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', sm: 'flex', flexDirection: 'column' },
          background: 'linear-gradient(135deg, #B7E0C2 0%, #EEF7EE 100%)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          variant="h3"
          sx={{
            color: '#4B9B4B',
            textAlign: 'center',
            px: 2,
          }}
        >
          Welcome to Maple Questionnaire
        </Typography>
        <p style={{ color: '#3B8B4B' }}>More Than Solving Psychological Problems</p>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 4,
          backgroundColor: 'background.paper',
        }}
      >
        <Paper elevation={6} sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 2, color: 'primary.main', textAlign: 'center' }}
          >
            Log In with Google
          </Typography>

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              backgroundColor: '#4B9B4B', 
              color: '#FFFFFF', 
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none', 
              borderRadius: '8px', 
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', 
              '&:hover': {
                backgroundColor: '#3B8B4B', 
              },
            }}
            onClick={handleGoogleLogin}
          >
            Sign in with Google
          </Button>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default LoginPage;