import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper } from '@mui/material';

export default function StarQuestionnaires() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const storedStr = localStorage.getItem('myQuestionnaires');
    if (storedStr) {
      const all = JSON.parse(storedStr);
      const filtered = all.filter(q => q.isStarred === true && q.isDeleted !== true);
      setStars(filtered);
    }
  }, []);

  if (stars.length === 0) {
    return <Typography sx={{ m: 2 }}>No starred questionnaires.</Typography>;
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Star Questionnaires
      </Typography>

      {stars.map((q) => (
        <Paper key={q.id} sx={{ p: 2, mb: 2 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {q.title}
          </Typography>
          <Typography variant="body2">
            Questions: {q.questions?.length || 0}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
