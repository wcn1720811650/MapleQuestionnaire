import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link
} from '@mui/material';

function ForgotPasswordPage() {
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
          Reset Your Password
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
            Forgot Password
          </Typography>

          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter the email address associated with your account. 
            We will send a link to reset your password.
          </Typography>

          <Box 
            component="form" 
            noValidate 
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              variant="outlined"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
            >
              Send Reset Link
            </Button>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Link href="/login" variant="body2">
                Back to Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default ForgotPasswordPage;
