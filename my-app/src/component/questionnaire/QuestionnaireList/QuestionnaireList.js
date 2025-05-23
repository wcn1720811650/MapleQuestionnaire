import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Box,
  Checkbox,
  Typography,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Switch,
  FormControlLabel ,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import PublishIcon from '@mui/icons-material/Publish'
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
  disableSwitch = false,
  groups = [], 
  onPublish = () => {},
  showPublish = false
}) {
  const [list, setList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedQ, setSelectedQ] = useState(null);
  const [publishDialogOpen, setPublishDialogOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [currentQId, setCurrentQId] = useState(null);
  const loadData = useCallback(async () => {
    try {
      const response = await axios.get('/api/questionnaires', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const all = response.data.filter(filterFn); 
      setList(all);
    } catch (error) {
      console.error('Error loading questionnaires:', error);
      setList([]); 
    }
  }, [filterFn]);

  useEffect(() => {
    loadData();
  }, [loadData]); 

  const handleTogglePublic = async (id, currentStatus) => {
    try {
      await axios.post(`/api/questionnaires/${id}/public`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setList((prev) =>
        prev.map((q) =>
          q.id === id ? { ...q, isPublic: !currentStatus } : q
        )
      );
    } catch (error) {
      console.error('Error toggling public status:', error);
    }
  };

  function handleStar(qid) {
    axios
      .post(
        `/api/questionnaires/${qid}/star`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then(() => loadData()) 
      .catch((error) => console.error('Error starring questionnaire:', error));
  }

  function handleDelete(qid) {
    axios
      .post(
        `/api/questionnaires/${qid}/delete`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then(() => loadData())
      .catch((error) => console.error('Error deleting questionnaire:', error));
  }

  function handleRestore(qid) {
    axios
      .post(
        `/api/questionnaires/${qid}/restore`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      .then(() => loadData())
      .catch((error) => console.error('Error restoring questionnaire:', error));
  }

  function handleDeleteForever(qid) {
    axios
      .delete(`/api/questionnaires/${qid}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      })
      .then(() => loadData())
      .catch((error) => console.error('Error permanently deleting questionnaire:', error));
  }

  function handleOpenModal(q) {
    setSelectedQ(q);
    setOpenDialog(true);
  }

  function handleCloseModal() {
    setOpenDialog(false);
    setSelectedQ(null);
  }
  const handleOpenPublish = (qid) => {
    setCurrentQId(qid);
    setSelectedGroups([]);
    setPublishDialogOpen(true);
  };

  const handleClosePublish = () => {
    setPublishDialogOpen(false);
    setCurrentQId(null);
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handlePublish = () => {
    if (!currentQId || selectedGroups.length === 0) return;
    onPublish(currentQId, selectedGroups);
    handleClosePublish();
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
          <Box sx={{ display: 'flex', gap: 1, alignItems:'center' }}>
          {!disableSwitch && (
            <FormControlLabel
              control={
                <Switch
                  checked={q.isPublic}
                  onChange={() => handleTogglePublic(q.id, q.isPublic)}
                  disabled={disableSwitch} 
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#4B9B4B',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#4B9B4B',
                    },
                  }}
                />
              }
              label={q.isPublic ? 'Public' : 'Private'}
            />
          )}

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
            {showPublish && (
              <IconButton
                color="primary"
                onClick={() => handleOpenPublish(q.id)}
              >
                <PublishIcon />
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
              <Button onClick={handleCloseModal} variant="contained" sx={{ backgroundColor:'#4B9B4B' }}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Dialog
        open={publishDialogOpen}
        onClose={handleClosePublish}
        maxWidth="sm"
      >
        <DialogTitle>Publish Questionnaire</DialogTitle>
        <DialogContent>
          <Typography>Select Groups:</Typography>
          {groups.map(group => (
            <FormControlLabel
              key={group.id}
              control={
                <Checkbox
                  checked={selectedGroups.includes(group.id)}
                  onChange={() => handleGroupSelect(group.id)}
                />
              }
              label={`${group.name} (${group.customers.length || 0})`}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePublish}>Cancel</Button>
          <Button
            onClick={handlePublish}
            variant="contained"
            disabled={selectedGroups.length === 0}
          >
            Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}