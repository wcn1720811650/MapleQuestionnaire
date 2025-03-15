// components/questionnaire/UserQuestionnaireList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import SingleChoiceRender from '../../questionType/SingleChoiceRender';
import MultipleChoiceRender from '../../questionType/MultipleChoiceRender';
import TextRender from '../../questionType/TextRender';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export default function UserQuestionnaireList({ list = [] }) {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedQ, setSelectedQ] = React.useState(null);
  const [submittedStatus, setSubmittedStatus] = useState({});
  useEffect(() => {
    const fetchSubmissionStatus = async () => {
      const statusMap = {};
      for (const q of list) {
        try {
          const response = await axios.get(`/api/questionnaires/${q.id}/submission-status`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          statusMap[q.id] = response.data.isSubmitted;
        } catch (error) {
          console.error('Error fetching status:', error);
          statusMap[q.id] = false;
        }
      }
      setSubmittedStatus(statusMap);
    };
  
    if (list.length > 0) {
      fetchSubmissionStatus();
    }
  }, [list]);

  const handleOpenModal = (q) => {
    setSelectedQ(q);
    setOpenDialog(true);
  };

  const handleCloseModal = () => {
    setOpenDialog(false);
    setSelectedQ(null);
  };

  if (list.length === 0) {
    return <Typography sx={{ m: 2 }}>No questionnaires found.</Typography>;
  }

  const getCardStyle = (id) => ({
    p: 2.5,
    mb: 2,
    backgroundImage: 'linear-gradient(to right, #ffffff, #9AC89A, #4B9B4B)', 
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[2],
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      transform: 'translateY(-3px)',
      boxShadow: theme.shadows[4],
      '&::before': {
        transform: 'scaleX(1)'
      }
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: 3,
      background: theme.palette.success.dark, 
      transform: 'scaleX(0)',
      transition: 'transform 0.3s ease'
    }
  });
  return (
    <Box sx={{ 
      p: 2,
      minHeight: 'calc(100vh - 64px)'
    }}>
      {list.map((q) => (
        <Paper key={q.id} sx={getCardStyle(q.id)}>
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            mb: 1.5,
            position: 'relative'
          }}>
            <CheckCircleOutlineIcon
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: submittedStatus[q.id] ? theme.palette.success.main : theme.palette.grey[400],
                fontSize: '1.8rem'
              }}
            />
            <Typography
              variant="h6"
              sx={{
                cursor: 'pointer',
                fontWeight: 600,
                color: theme.palette.text.primary,
                pr: 4,
                '&:hover': {
                  color: theme.palette.primary.main
                }
              }}
              onClick={() => handleOpenModal(q)}
            >
              {q.title}
            </Typography>
          </Box>

          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="body2" sx={{ 
              color: theme.palette.text.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <span>Questions: {q.questions?.length || 0}</span>
              {submittedStatus[q.id] && (
                <Box sx={{
                  bgcolor: theme.palette.success.light,
                  color: theme.palette.success.dark,
                  px: 1,
                  borderRadius: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.5
                }}>
                  <CheckCircleOutlineIcon fontSize="small" />
                  <span>Submitted</span>
                </Box>
              )}
            </Typography>

            {!submittedStatus[q.id] ? (
              <Button
                component={Link}
                to={`/quiz/${q.id}`}
                variant="contained"
                sx={{
                  borderRadius: 20,
                  px: 3,
                  textTransform: 'none',
                  boxShadow: theme.shadows[1],
                  '&:hover': {
                    boxShadow: theme.shadows[3]
                  }
                }}
              >
                Answer
              </Button>
            ) : (
              <Typography variant="body2" sx={{ 
                color: theme.palette.success.dark,
                fontWeight: 500
              }}>
                Completed
              </Typography>
            )}
          </Box>
        </Paper>
      ))}
      <Dialog open={openDialog} onClose={handleCloseModal} maxWidth="md" fullWidth>
        {selectedQ && (
          <>
            <DialogTitle>{selectedQ.title}</DialogTitle>
            <DialogContent dividers>
              {selectedQ.questions && selectedQ.questions.length > 0 ? (
                selectedQ.questions.map((item) => (
                  <Box
                    key={item.id}
                    sx={{ mb: 2, borderBottom: '1px solid #ccc', pb: 1 }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">
                      {item.type === 'text'
                        ? 'Fill-in (Text)'
                        : item.type === 'singleChoice'
                        ? 'Single Choice'
                        : 'Multiple Choice'}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      Q: {item.text || '(No question text)'}
                    </Typography>
                    {item.type === 'singleChoice' && (
                      <SingleChoiceRender question={item} />
                    )}
                    {item.type === 'multipleChoice' && (
                      <MultipleChoiceRender question={item} />
                    )}
                    {item.type === 'text' && <TextRender question={item} />}
                  </Box>
                ))
              ) : (
                <Typography>No questions in this questionnaire.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseModal}
                variant="contained"
                sx={{ backgroundColor: '#4B9B4B' }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}