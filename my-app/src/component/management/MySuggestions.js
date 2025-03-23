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
        <CardContent sx={{ p: 4 }}>
          <Button
            variant="contained"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 500,
              textTransform: 'none',
              backgroundColor: '#4CAF50', 
              '&:hover': {
                backgroundColor: '#45a049', 
                boxShadow: 2
              }
            }}
            endIcon={<ChevronRightRounded />}
            onClick={() => navigate('/consultantSuggestions')}
          >
            View Suggestions
          </Button>
        </CardContent>
  );
};

export default Report;