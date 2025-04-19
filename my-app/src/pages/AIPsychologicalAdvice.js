import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  CircularProgress,
} from '@mui/material';
import { ArrowBack, Lightbulb, Print } from '@mui/icons-material';
import axios from 'axios';

const AIPsychologicalAdvice = () => {
  const { answerId } = useParams();
  const navigate = useNavigate();
  const [adviceData, setAdviceData] = useState({
    advice: null,
    questionnaireTitle: '',
    qaPairs: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await axios.get(`/api/AIadvice/${answerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          },
          timeout: 30000 
        });
        
        if (!response.data || !response.data.data) {
          throw new Error('Invalid response structure');
        }

        setAdviceData({
          advice: response.data.data.advice,
          questionnaireTitle: response.data.data.questionnaireTitle || 'Questionnaire',
          qaPairs: response.data.data.qaPairs || []
        });
      } catch (error) {
        console.error('Failed to fetch advice:', error);
        setAdviceData({
          advice: 'Failed to load advice. Please try again later.',
          questionnaireTitle: 'Error',
          qaPairs: []
        });
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
              {adviceData.questionnaireTitle} - AI Advice
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Personalized recommendations based on your survey answers
            </Typography>
          </Box>
        </Box>
        
        {!loading && (
          <>
            {/* 显示问答对 */}
            {adviceData.qaPairs.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Your Answers</Typography>
                {adviceData.qaPairs.map((pair, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      Q: {pair.question}
                    </Typography>
                    <Typography variant="body1" sx={{ ml: 2, mb: 2 }}>
                      A: {pair.answer}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* 显示AI建议 */}
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
                {adviceData.advice || 'Failed to obtain suggested content'}
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
                startIcon={<Print />}
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