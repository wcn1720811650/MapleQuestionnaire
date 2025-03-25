import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  CircularProgress, 
  Divider, 
  Alert,
  Avatar,
  Chip,
  Stack,
  useTheme,
  Button
} from '@mui/material';
import { Lightbulb, Person, CalendarToday, Task, ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function UserSuggestions() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get('/api/suggestions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        console.log('API Response:', response.data);
        
        if (response.data.success) {
          setSuggestions(response.data.data || []);
        } else {
          setError('Failed to load suggestions');
        }
      } catch (err) {
        console.error('Failed to get suggestions:', err);
        setError(err.response?.data?.error || 'Error loading suggestions');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSuggestions();
  }, []);

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        
        <Typography variant="h4" sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Lightbulb fontSize="large" color="primary" />
          My consulting advice
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
          return
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : suggestions.length > 0 ? (
        suggestions.map(suggestion => (
          <Paper 
            key={suggestion.id} 
            sx={{ 
              p: 3, 
              mb: 3, 
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
                  {suggestion.questionnaire?.title || 'Untitled Questionnaire'}
                </Typography>
                <Chip 
                  label={`Consultant: ${suggestion.consultant?.name || 'unknown'}`}
                  size="small"
                  icon={<Person fontSize="small" />}
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
              {suggestion.content}
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                label={new Date(suggestion.createdAt).toLocaleDateString()}
                size="small"
                icon={<CalendarToday fontSize="small" />}
                variant="outlined"
              />
            </Stack>
          </Paper>
        ))
      ) : (
        <Paper sx={{ 
          p: 4, 
          textAlign: 'center', 
          bgcolor: '#f9f9f9', 
          borderRadius: 2,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 3
          }
        }}>
          <Typography variant="body1" color="textSecondary">
           There are no counseling recommendations yet. When counselors have recommendations for you, they will appear here.          </Typography>
        </Paper>
      )}
    </Box>
  );
}