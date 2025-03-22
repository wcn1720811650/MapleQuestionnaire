// src/pages/SubmissionDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Alert,
  Stack,
  TextField,
  Snackbar
} from '@mui/material';
import SingleChoiceRender from '../component/questionType/SingleChoiceRender';
import MultipleChoiceRender from '../component/questionType/MultipleChoiceRender';
import TextRender from '../component/questionType/TextRender';

const validateResponse = (response) => {
  if (!response?.success) throw new Error('API request failed');
  
  const { questionnaire, answers, suggestion } = response.data;
  
  if (!questionnaire?.title) throw new Error('Invalid questionnaire data');
  if (!Array.isArray(questionnaire.questions)) throw new Error('Invalid questions format');
  
  return { 
    ...response,
    questionnaire: {
      ...questionnaire,
      createdBy: String(questionnaire.createdBy || '')
    },
    answers,
    suggestion: suggestion || ''
  };
};

export default function SubmissionDetails() {
  const { userId, questionnaireId } = useParams();
  const navigate = useNavigate();
  const [state, setState] = useState({
    loading: true,
    error: null,
    data: null
  });
  const [suggestion, setSuggestion] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/consultant/${userId}/${questionnaireId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            signal: controller.signal
          }
        );

        const validatedData = validateResponse(data);
        
        setState({
          loading: false,
          error: null,
          data: {
            ...validatedData,
            questionnaire: {
              ...validatedData.questionnaire,
              questions: validatedData.questionnaire.questions.map(q => ({
                ...q,
                text: q.text || 'Unnamed question'
              }))
            }
          }
        });
        setSuggestion(validatedData.suggestion);
      } catch (err) {
        if (axios.isCancel(err)) return;
        
        console.error('Data loading failed:', {
          error: err.message,
          response: err.response?.data,
          endpoint: `/api/consultant/${userId}/${questionnaireId}`
        });

        setState({
          loading: false,
          error: {
            message: err.response?.data?.error || 'Unable to load data',
            details: err.response?.data?.details || err.message
          }
        });
      }
    };
    
    fetchData();

    return () => controller.abort();
  }, [userId, questionnaireId]);

  const handleSubmitSuggestion = async () => {
    if (!suggestion.trim()) {
      setSnackbar({ message: 'Suggestion cannot be empty', severity: 'warning' });
      return;
    }
    
    setSubmitting(true);
    try {
      await axios.post(
        `/api/consultant/submissions/${userId}/${questionnaireId}/suggestions`,
        { suggestion },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      
      setSnackbar({ 
        message: 'Treatment suggestion saved successfully', 
        severity: 'success' 
      });
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          suggestion: suggestion
        }
      }));
    } catch (err) {
      setSnackbar({ 
        message: `Failed to save suggestion: ${err.response?.data?.error || err.message}`, 
        severity: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderContent = () => {
    if (state.loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress size={60} />
          <Typography variant="body1" sx={{ ml: 2 }}>
            Loading submission details...
          </Typography>
        </Box>
      );
    }

    if (state.error) {
      return (
        <Box sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body1" component="div">
              Error: {state.error.message}
            </Typography>
            <Typography variant="body2" component="div">
              Details: {state.error.details}
            </Typography>
            <Typography variant="caption" component="div">
              Questionnaire ID: {questionnaireId}, User ID: {userId}
            </Typography>
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate(-1)}
            sx={{ mt: 2 }}
          >
            Return to Submission List
          </Button>
        </Box>
      );
    }

    return (
      <>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate(-1)}
            sx={{ borderRadius: 2 }}
          >
            &larr; Return
          </Button>
          <Typography variant="caption" color="textSecondary">
            Submission ID: {questionnaireId}
          </Typography>
        </Stack>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
          <Typography 
            variant="h4"
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.light',
              pb: 2,
              mb: 4
            }}
          >
            {state.data.questionnaire.title}
          </Typography>

          <Box sx={{ 
            bgcolor: '#f8f9fa',
            p: 2,
            borderRadius: 2,
            mb: 4
          }}>
            <Typography variant="subtitle1">
              <strong>Submit User:</strong> {state.data.data.user?.name || '未知用户'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              User ID: {userId}
            </Typography>
          </Box>

          {state.data.questionnaire.questions.map((question, index) => (
            <Box 
              key={question.id}
              sx={{
                mb: 4,
                "&:not(:last-child)": {
                  borderBottom: 1,
                  borderColor: 'divider',
                  pb: 4
                }
              }}
            >
              <Typography 
                variant="h6"
                sx={{ 
                  fontWeight: 500,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box 
                  component="span"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderRadius: '50%',
                    width: 28,
                    height: 28,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 1.5
                  }}
                >
                  {index + 1}
                </Box>
                {question.text}
              </Typography>

              <Box sx={{ 
                pl: 4,
                borderLeft: '3px solid',
                borderColor: 'success.light',
                bgcolor: '#f8fff0',
                borderRadius: 1,
                p: 2
              }}>
                <Typography 
                  variant="body2"
                  color="textSecondary"
                  sx={{ mb: 1.5 }}
                >
                  User Answer:
                </Typography>

                {question.type === 'singleChoice' ? (
                  <SingleChoiceRender
                    question={{
                      ...question,
                      answer: state.data.answers[question.id].value || ''
                    }}
                    isReadOnly
                  />
                ) : question.type === 'multipleChoice' ? (
                  <MultipleChoiceRender
                    question={{
                      ...question,
                      answer: state.data.answers[question.id].value || []
                    }}
                    isReadOnly
                  />
                ) : (
                  <TextRender
                    question={{
                      ...question,
                      answer: state.data.answers[question.id].value || ''
                    }}
                    isReadOnly
                  />
                )}
              </Box>
            </Box>
          ))}

          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>
              Treatment Suggestion
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Enter your professional treatment recommendation..."
              variant="outlined"
              sx={{ mb: 3 }}
              InputProps={{
                style: { fontFamily: 'Arial', fontSize: '1rem' }
              }}
            />
            
            <Stack direction="row" spacing={2} alignItems="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitSuggestion}
                disabled={submitting}
                startIcon={submitting && <CircularProgress size={20} />}
                sx={{ minWidth: 120 }}
              >
                {submitting ? 'Saving...' : 'Submit Suggestion'}
              </Button>

              {state.data?.suggestion && (
                <Paper elevation={1} sx={{ p: 2, mt: 3, backgroundColor: '#f8fff0', flex: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Current Recommendation:
                  </Typography>
                  <Typography variant="body1" whiteSpace="pre-line">
                    {state.data.suggestion}
                  </Typography>
                </Paper>
              )}
            </Stack>
          </Box>
        </Paper>
      </>
    );
  };

  return (
    <Box sx={{ 
      p: { xs: 2, md: 4 },
      maxWidth: 1200,
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      {renderContent()}
      
      <Snackbar
        open={!!snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(null)} 
          severity={snackbar?.severity}
          sx={{ width: '100%' }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}