// src/pages/createQuestionnaire.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Paper
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SingleChoiceRender from '../questionType/SingleChoiceRender';
import MultipleChoiceRender from '../questionType/MultipleChoiceRender';
import TextRender from '../questionType/TextRender';

export default function CreateQuestionnaire({ router }) {
  const [title, setTitle] = useState('');

  const [questions, setQuestions] = useState([]);

  const [openDialog, setOpenDialog] = useState(false);

  const [questionType, setQuestionType] = useState('singleChoice');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState([{ id: 1, text: '' }]);

  function handleOpenDialog() {
    setQuestionType('singleChoice');
    setQuestionText('');
    setOptions([{ id: 1, text: '' }]);
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
  }

  function handleChangeQuestionType(e) {
    const newType = e.target.value;
    setQuestionType(newType);
    if (newType === 'text') {
      setOptions([]);
    } else if (newType === 'singleChoice' || newType === 'multipleChoice') {
      if (options.length === 0) {
        setOptions([{ id: 1, text: '' }]);
      }
    }
  }

  function handleChangeQuestionText(e) {
    setQuestionText(e.target.value);
  }

  function handleAddOption() {
    const newId = (options[options.length - 1]?.id || 0) + 1;
    setOptions([...options, { id: newId, text: '' }]);
  }

  function handleRemoveOption(id) {
    const newOptions = options.filter((opt) => opt.id !== id);
    setOptions(newOptions);
  }

  function handleChangeOptionText(id, newText) {
    const newOptions = options.map((opt) =>
      opt.id === id ? { ...opt, text: newText } : opt
    );
    setOptions(newOptions);
  }

  // click “Add” and add to questions
  function handleConfirmAdd() {
    const newQuestion = {
      id: Date.now(),
      type: questionType,
      text: questionText,
      options: questionType === 'text' ? [] : options,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    handleCloseDialog();
  }

  // submit the whole questionnaire to localStorage
  function handleSubmitQuestionnaire() {
    // 构造问卷对象
    const newQ = {
      id: Date.now(), 
      title: title || 'Untitled Questionnaire',
      questions,
    };

    const storedStr = localStorage.getItem('myQuestionnaires');
    let arr = storedStr ? JSON.parse(storedStr) : [];
    arr.push(newQ);
    localStorage.setItem('myQuestionnaires', JSON.stringify(arr));

    setTitle('');
    setQuestions([]); 

  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create Questionnaire
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          label="Questionnaire Title"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Box>

      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleOpenDialog}
        sx={{ mb: 2 }}
      >
        Add Question
      </Button>

      {questions.length === 0 ? (
        <Typography>No questions yet.</Typography>
      ) : (
        questions.map((q) => (
          <Paper
            key={q.id}
            sx={{
              p: 2,
              mb: 2,
              borderLeft: '4px solid #1976d2',
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
              {q.type === 'text'
                ? 'Fill-in (Text)'
                : q.type === 'singleChoice'
                ? 'Single Choice'
                : 'Multiple Choice'}
            </Typography>

            <Typography variant="body1" sx={{ mb: 2 }}>
              Q: {q.text || '(No question text)'}
            </Typography>
            {q.type === 'singleChoice' && <SingleChoiceRender question={q} />}
            {q.type === 'multipleChoice' && <MultipleChoiceRender question={q} />}
            {q.type === 'text' && <TextRender question={q} />}
          </Paper>
        ))
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitQuestionnaire}
      >
        Submit Questionnaire
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Add New Question</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2">Question Type:</Typography>
            <Select
              size="small"
              fullWidth
              value={questionType}
              onChange={handleChangeQuestionType}
              sx={{ mb: 2 }}
            >
              <MenuItem value="singleChoice">Single Choice</MenuItem>
              <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
              <MenuItem value="text">Fill-in (Text)</MenuItem>
            </Select>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2">Question Text:</Typography>
            <TextField
              size="small"
              fullWidth
              value={questionText}
              onChange={handleChangeQuestionText}
              placeholder="Enter question statement..."
            />
          </Box>

          {questionType !== 'text' && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Options:</Typography>
              {options.map((opt, idx) => (
                <Box
                  key={opt.id}
                  sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                >
                  <TextField
                    size="small"
                    fullWidth
                    value={opt.text}
                    onChange={(e) => handleChangeOptionText(opt.id, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                  />
                  <IconButton onClick={() => handleRemoveOption(opt.id)} sx={{ ml: 1 }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
              <Button onClick={handleAddOption} sx={{ mt: 1 }}>
                Add Option
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmAdd} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
