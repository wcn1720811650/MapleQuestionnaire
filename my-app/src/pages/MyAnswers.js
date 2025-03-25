import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, List, Button, CircularProgress, Divider } from '@mui/material';
import axios from 'axios';
import { useTheme, Avatar, Chip, Stack } from '@mui/material';
import { Task, CalendarToday, CheckCircle } from '@mui/icons-material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MyAnswers = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await axios.get('/api/user/answers', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setAnswers(response.data.data);
      } catch (error) {
        console.error('Failed to fetch answers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <CheckCircle fontSize="large" color="primary" />
           My answer record
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{
            textTransform: 'none',
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
              borderColor: theme.palette.primary.main
            }
          }}
        >
          Return
        </Button>
      </Box>
      
      <List>
        {answers.map(answer => (
          <Paper 
            key={answer.id} 
            sx={{ 
              mb: 3, 
              p: 3,
              borderRadius: 4,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 6,
                backgroundColor: theme.palette.background.paper
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <Task />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {answer.questionnaireTitle}
                </Typography>
                <Chip 
                  label={`Answer status: Completed`}
                  size="small"
                  color="success"
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Stack>
            
            <Divider sx={{ my: 1 }} />
            
              <Typography variant="body1" sx={{ 
                whiteSpace: 'pre-wrap',
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                mt: 2,
                fontStyle: 'italic'
              }}>
                {answer.answer}
              </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                label={`${new Date(answer.createdAt).toLocaleString()}`}
                size="small"
                icon={<CalendarToday fontSize="small" />}
                variant="outlined"
              />
            </Stack>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default MyAnswers;