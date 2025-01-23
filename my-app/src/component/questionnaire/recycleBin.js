import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, IconButton } from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore';

export default function RecycleBin() {
  const [deleted, setDeleted] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  function loadData() {
    const storedStr = localStorage.getItem('myQuestionnaires');
    if (storedStr) {
      const all = JSON.parse(storedStr);
      const filtered = all.filter(q => q.isDeleted === true);
      setDeleted(filtered);
    } else {
      setDeleted([]);
    }
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

  if (deleted.length === 0) {
    return <Typography sx={{ m: 2 }}>No questionnaires in Recycle Bin.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Recycle Bin
      </Typography>

      {deleted.map((q) => (
        <Paper key={q.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
            {q.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Questions: {q.questions?.length || 0}
          </Typography>

          <Box>
            <IconButton 
              color="primary" 
              onClick={() => handleRestore(q.id)}
              title="Restore"
            >
              <RestoreIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}
    </Box>
  );
}