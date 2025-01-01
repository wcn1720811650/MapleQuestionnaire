// LoginPage.js
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
} from '@mui/material';

function LoginPage() {
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
          display: { xs: 'none', sm: 'flex', flexDirection:'column' }, 
          
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
        <p style={{color:'#3B8B4B'}}>More Than Solving Psychological Problems</p>
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
            Log In
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus
              autoComplete="email"
              variant="outlined"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="outlined"
            />

            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember Me"
              sx={{ mt: 1 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
            >
              Log In
            </Button>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Link href="/forgetpassword" variant="body2">
                Forgot password?
              </Link>
              <Link href="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default LoginPage;
