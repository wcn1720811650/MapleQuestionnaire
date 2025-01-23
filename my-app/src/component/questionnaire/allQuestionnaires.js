import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton 
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import DeleteIcon from '@mui/icons-material/Delete';

export default function AllQuestionnaires() {
  const [list, setList] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const storedStr = localStorage.getItem('myQuestionnaires');
    if (storedStr) {
      const all = JSON.parse(storedStr);
      const filtered = all.filter((q) => q.isDeleted !== true);
      setList(filtered);
    } else {
      setList([]);
    }
  }

  // click "star" icon
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

  // click "delete" icon
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

  if (list.length === 0) {
    return <Typography sx={{ m: 2 }}>No questionnaires found.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        All Questionnaires
      </Typography>

      {list.map((q) => (
        <Paper 
          key={q.id} 
          sx={{ p: 2, mb: 2, position: 'relative' }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            {q.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Questions: {q.questions?.length || 0}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <IconButton 
              color={q.isStarred? 'primary':'default'} 
              onClick={() => handleStar(q.id)} 
              title={q.isStarred? 'star':'unstar'} 
            >
              <StarIcon />
            </IconButton>

            <IconButton 
              color="error" 
              onClick={() => handleDelete(q.id)} 
              title="Delete"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}
