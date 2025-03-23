import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Paper, CircularProgress, Divider, Alert } from '@mui/material';

export default function UserSuggestions() {
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
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 500 }}>
        My consulting advice
      </Typography>
      
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
          <Paper key={suggestion.id} sx={{ p: 3, mb: 3, borderRadius: 2, boxShadow: 2 }}>
            <Typography variant="h6" color="primary">
              {suggestion.questionnaire?.title || 'Untitled Questionnaire'}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
              Consultant: {suggestion.consultant?.name || 'Unknown'} | 
              {new Date(suggestion.createdAt).toLocaleDateString()}
            </Typography>
            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" sx={{ 
              whiteSpace: 'pre-wrap',
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              mt: 2
            }}>
              {suggestion.content}
            </Typography>
          </Paper>
        ))
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Typography variant="body1" color="textSecondary">
            There are no consulting suggestions yet. When a consultant provides you with a suggestion, it will be displayed here.
          </Typography>
        </Paper>
      )}
    </Box>
  );
}