// components/questionnaire/UserQuestionnaireList.js
import React from 'react';
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

export default function UserQuestionnaireList({ list = [] }) {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedQ, setSelectedQ] = React.useState(null);

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

  return (
    <Box sx={{ p: 2 }}>
      {list.map((q) => (
        <Paper
          key={q.id}
          sx={{
            p: 2,
            mb: 2,
            backgroundImage: 'linear-gradient(to right, #ffffff, #9AC89A, #4B9B4B)',
            borderRadius: 2,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{ cursor: 'pointer' }}
            onClick={() => handleOpenModal(q)}
          >
            {q.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Questions: {q.questions?.length || 0}
          </Typography>
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