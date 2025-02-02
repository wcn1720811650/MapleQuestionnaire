import React from 'react';
import Logo from '../images/logo/logo.jpg'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Link
} from '@mui/material';

function HomePage() {
  return (
    <Box sx={{ backgroundColor: '#F9FCFA', minHeight: '100vh' }}>
      <AppBar
        position="sticky"
        sx={{
          backgroundColor: '#fff',
          color: '#333',
          top: 0,    
          zIndex: 9999,   
        }}
      >
        <Toolbar sx={{justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', display:"flex",flexDirection:"row",alignItems:"center" }}>
            <img 
                src={Logo}
                style={{ width: '100%', maxWidth: 50 }}
                alt='logo'
            >
            </img>
            <div>
                Maple Questionnaire
            </div>
          </Typography>
          <Box>
            <Button sx={{ mr: 2 }} href='/login' color="inherit">Sign In</Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 6,
          mb: 6,
        }}
      >
        <Box
          sx={{
            flex: 1,
            pr: { md: 4 },
            textAlign: { xs: 'center', md: 'left' },
            mb: { xs: 4, md: 0 },
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Intelligent assessment platform
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
            Make testing more efficient, accurate, and intelligent. We specialize 
            in providing comprehensive assessment solutions for businesses and individuals.
          </Typography>
          <Button variant="contained" href='/login' color="primary" size="large" sx={{ borderRadius: 2, color:"white" }}>
            Start Evaluation
          </Button>
        </Box>

        <Box sx={{ flex: 1, textAlign: 'center'}}>
          <img 
            src={Logo}
            style={{ width: '100%', maxWidth: 300 }}
            alt='logo'
          >
          </img>
        </Box>
      </Container>

      <Box
        sx={{
          backgroundColor: '#6BA17C',
          py: 6,
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" sx={{ mb: 2 }}>
            Start Your Professional Evaluations with Maple Questionnaire
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Get started quickly and easily build oyur own evaluation scenarios.
          </Typography>
          <Button variant="contained" href='/login' color="secondary" size="large">
            Get Started
          </Button>
        </Container>
      </Box>

      <Box
        sx={{
          textAlign: 'center',
          py: 3,
        }}
      >
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          © 2025 Maple Questionnaire. All rights reserved.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          <Link href="#" underline="hover">Privacy Policy</Link> | <Link href="#" underline="hover">Terms of Service</Link>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <span>Contact us: mmmapleleave@gmail.com</span>
        </Typography>
      </Box>
    </Box>
  );
}

export default HomePage;
