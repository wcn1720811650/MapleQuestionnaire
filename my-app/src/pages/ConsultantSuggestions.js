// pages/ConsultantSuggestions.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box,
  Typography,
  Paper,
  List,
  CircularProgress,
  Container,
  Avatar,
  Chip,
  Stack,
  useTheme,
  Button
} from '@mui/material';
import ViewStreamIcon from '@mui/icons-material/ViewStream';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Lightbulb, Person, CalendarToday } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export default function ConsultantSuggestions() {
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/consultant/my-suggestions', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setSuggestions(data.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ 
        mb: 4,
        fontWeight: 600,
        color: 'text.primary',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexDirection: 'row',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems:'center'}}>
            <Lightbulb fontSize="large" color="primary" />
            My Suggestions
        </Box>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            mt: { xs: 2, md: 0 },
            borderRadius: 50,
            px: 3,
            color:'white',
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: 'success.dark' },
          }}
          startIcon={<ArrowBackIosIcon />}
        >
          Return to List
        </Button>
      </Typography>
      
      <List>
        {suggestions.map((item) => (
          <Paper 
            key={item.id}
            elevation={3}
            sx={{ 
              mb: 3,
              p: 3,
              borderRadius: 4,
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: theme.shadows[6],
                backgroundColor: theme.palette.background.paper
              }
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <ViewStreamIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {item.questionnaire.title}
                </Typography>
                <Chip 
                  label={`To: ${item.user.name}`}
                  size="small"
                  icon={<Person fontSize="small" />}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Stack>
            
            <Typography variant="body1" sx={{ 
              mb: 2,
              color: 'text.secondary',
              fontStyle: 'italic'
            }}>
              {item.content}
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Chip
                label={new Date(item.createdAt).toLocaleDateString()}
                size="small"
                icon={<CalendarToday fontSize="small" />}
                variant="outlined"
              />
            </Stack>
          </Paper>
        ))}
      </List>
    </Container>
  );
}