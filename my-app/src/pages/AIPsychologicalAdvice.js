import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Lightbulb } from '@mui/icons-material';
import axios from 'axios';

const AIPsychologicalAdvice = () => {
  const { answerId } = useParams();
  const navigate = useNavigate();
  const [advice, setAdvice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await axios.get(`/api/AIadvice/${answerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAdvice(response.data.data.advice);
      } catch (error) {
        console.error('Failed to fetch advice:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdvice();
  }, [answerId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3,
      maxWidth: 'md',
      mx: 'auto',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ 
          mb: 3,
          borderRadius: 2,
          textTransform: 'none'
        }}
      >
        return
      </Button>

      <Paper sx={{ 
        p: 3,
        borderRadius: 2,
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          <Lightbulb 
            color="primary" 
            sx={{ 
              fontSize: 32,
              mr: 2
            }} 
          />
          <Box>
            <Typography 
              variant="h5"
              sx={{ 
                fontWeight: 600,
                color: 'text.primary',
                mb: 0.5
              }}
            >
              AI psychological advice
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Personalized recommendations based on your survey answers
            </Typography>
          </Box>
        </Box>
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            py: 4
          }}>
            <CircularProgress size={50} sx={{ mb: 2 }}/>
            <Typography variant="body2" color="text.secondary">
                Generating suggestions for you...
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{
              p: 2,
              mb: 3,
              borderRadius: 1,
              bgcolor: 'background.paper',
              borderLeft: '4px solid',
              borderColor: 'primary.main'
            }}>
              <Typography 
                variant="body1" 
                sx={{ 
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.7,
                  fontSize: '1rem'
                }}
              >
                {advice || 'Failed to obtain suggested content'}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 3,
              pt: 2,
              borderTop: '1px solid',
              borderColor: 'divider'
            }}>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => window.print()}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  color: 'white',
                }}
              >
                Printing suggestions
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default AIPsychologicalAdvice;