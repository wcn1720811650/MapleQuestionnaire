// src/components/QuestionnaireList.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';

import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import SingleChoiceRender from '../../questionType/SingleChoiceRender';
import MultipleChoiceRender from '../../questionType/MultipleChoiceRender';
import TextRender from '../../questionType/TextRender';

/**
 * 
 * @param {Function} filterFn 
 * @param {Boolean} showStar 
 * @param {Boolean} showDelete 
 * @param {Boolean} showRestore 
 * @param {Boolean} showDeleteForever 
 */
export default function QuestionnaireList({
  filterFn = () => true,
  showStar = false,
  showDelete = false,
  showRestore = false,
  showDeleteForever = false,
}) {
  const [list, setList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQ, setSelectedQ] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const storedStr = localStorage.getItem('myQuestionnaires');
    if (storedStr) {
      let all = JSON.parse(storedStr);

      all = all.filter(filterFn);
      setList(all);
    } else {
      setList([]);
    }
  }

  function handleStar(qid) {
    const storedStr = localStorage.getItem('myQuestionnaires');
    if (!storedStr) return;
    let all = JSON.parse(storedStr);

    all = all.map(q => {
      if (q.id === qid) {
        return { ...q, isStarred: !q.isStarred };
      }
      return q;
    });
    localStorage.setItem('myQuestionnaires', JSON.stringify(all));
    loadData();
  }

  function handleDelete(qid) {
    const storedStr = localStorage.getItem('myQuestionnaires');
    if (!storedStr) return;
    let all = JSON.parse(storedStr);

    all = all.map(q => {
      if (q.id === qid) {
        return { ...q, isDeleted: true };
      }
      return q;
    });
    localStorage.setItem('myQuestionnaires', JSON.stringify(all));
    loadData();
  }

  function handleRestore(qid) {
    const storedStr = localStorage.getItem('myQuestionnaires');
    if (!storedStr) return;
    let all = JSON.parse(storedStr);

    all = all.map(q => {
      if (q.id === qid) {
        return { ...q, isDeleted: false };
      }
      return q;
    });
    localStorage.setItem('myQuestionnaires', JSON.stringify(all));
    loadData();
  }

  function handleDeleteForever(qid) {
    const storedStr = localStorage.getItem('myQuestionnaires');
    if (!storedStr) return;
    let all = JSON.parse(storedStr);
    all = all.filter(q => q.id !== qid);
    localStorage.setItem('myQuestionnaires', JSON.stringify(all));
    loadData();
  }

  function handleOpenModal(q) {
    setSelectedQ(q);
    setOpenDialog(true);
  }

  function handleCloseModal() {
    setOpenDialog(false);
    setSelectedQ(null);
  }

  if (list.length === 0) {
    return <Typography sx={{ m: 2 }}>No questionnaires found.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      {list.map((q) => (
        <Paper key={q.id} sx={{ p: 2, mb: 2 }}>
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

          <Box sx={{ display: 'flex', gap: 1 }}>
            {showStar && (
              <IconButton
                color={q.isStarred ? 'primary' : 'default'}
                onClick={() => handleStar(q.id)}
              >
                <StarIcon />
              </IconButton>
            )}

            {showDelete && (
              <IconButton
                color="error"
                onClick={() => handleDelete(q.id)}
              >
                <DeleteIcon />
              </IconButton>
            )}

            {showRestore && (
              <IconButton
                color="primary"
                onClick={() => handleRestore(q.id)}
              >
                <RestoreIcon />
              </IconButton>
            )}

            {showDeleteForever && (
              <IconButton
                color="primary"
                onClick={() => handleDeleteForever(q.id)}
              >
                <DeleteForeverIcon />
              </IconButton>
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
                    {item.type === 'text' && (
                      <TextRender question={item} />
                    )}
                  </Box>
                ))
              ) : (
                <Typography>No questions in this questionnaire.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} variant="contained">
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}
