// pages/ConsultantDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip,
  Button
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

export default function ConsultantDashboard() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
    
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/consultant', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setGroups(response.data);
      } catch (error) {
        console.error('Failed to obtain data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewDetails = (userId, questionnaireId) => {
    navigate(`/submissions/${userId}/${questionnaireId}`);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
      <Box sx={{display: 'flex', flexDirection:'row', justifyContent:'space-between', alignItems:"center" }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
          User submission management
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ mt: 2, mb: 3 }}
          color="success"
        >
          Return to Submission List
        </Button>
      </Box>
      {groups.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1">No management group yet</Typography>
        </Paper>
      ) : (
        groups.map((group) => (
          <Accordion key={group.groupId} sx={{ mb: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ flex: 1 }}>{group.groupName}</Typography>
                <Chip 
                  label={`${group.members.length} members`}
                  variant="outlined" 
                  sx={{ mr: 2 }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <List>
                {group.members.map((member) => (
                  <Accordion key={member.userId} sx={{ mb: 1 }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Typography sx={{ flex: 1 }}>
                          {member.userName}
                        </Typography>
                        <Chip
                          label={`${member.submissions.length} submissions`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      {member.submissions.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">
                          No submission record yet
                        </Typography>
                      ) : (
                        <List dense>
                          {member.submissions.map((submission) => (
                            <ListItem
                              key={submission.questionnaireId}
                              button
                              onClick={() => 
                                handleViewDetails(member.userId, submission.questionnaireId)
                              }
                              sx={{
                                '&:hover': { bgcolor: '#f5f5f5' },
                                borderRadius: 1
                              }}
                            >
                              <ListItemText
                                primary={submission.title}
                                secondary={`Submission time: ${new Date(
                                  submission.submittedAt
                                ).toLocaleString()}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </AccordionDetails>
                  </Accordion>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}