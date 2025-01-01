// SignUpPage.js
import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link
} from '@mui/material';

function SignUpPage() {
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
          display: { xs: 'none', sm: 'flex' },
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
          Create Your Google Account
        </Typography>
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
            Sign Up
          </Typography>

          <Box 
            component="form" 
            noValidate 
            sx={{ mt: 1 }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                variant="outlined"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                variant="outlined"
              />
            </Box>

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Gmail Address"
              name="email"
              autoComplete="email"
              helperText="use google to registe"
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
              autoComplete="new-password"
              variant="outlined"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
            >
              Sign Up
            </Button>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                Already have an account?
              </Typography>
              <Link  href="/login" variant="body2">
                Log In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default SignUpPage;
