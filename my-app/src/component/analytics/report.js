import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  CardContent,
} from '@mui/material';
import { ChevronRightRounded } from '@mui/icons-material';

const Report = () => {
  const navigate = useNavigate();

  return (
    <CardContent sx={{ p: 4, display: 'flex', gap: 3 }}>
      <Button
        variant="contained"
        sx={{
          px: 4,
          py: 2,
          borderRadius: 2,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          background: 'linear-gradient(145deg, #4CAF50, #66BB6A)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(145deg, #388E3C, #4CAF50)',
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
          },
          minWidth: 200,
          transition: 'all 0.3s ease'
        }}
        endIcon={<ChevronRightRounded />}
        onClick={() => navigate('/user/suggestions')}
      >
        View suggestions
      </Button>
      <Button
        variant="contained"
        sx={{
          px: 4,
          py: 2,
          borderRadius: 2,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          background: 'linear-gradient(145deg, #8BC34A, #9CCC65)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(145deg, #689F38, #8BC34A)',
            boxShadow: '0 4px 15px rgba(139, 195, 74, 0.3)'
          },
          minWidth: 200,
          transition: 'all 0.3s ease'
        }}
        endIcon={<ChevronRightRounded />}
        onClick={() => navigate('/my-answers')}
      >
        My answer record
      </Button>
    </CardContent>
  );
};

export default Report;