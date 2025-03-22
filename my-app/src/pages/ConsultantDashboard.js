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
  Button,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';

export default function ConsultantDashboard() {
  const theme = useTheme();
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
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh'
      }}>
        <CircularProgress
          size={60}
          sx={{ color: theme.palette.primary.main }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{
      p: { xs: 2, md: 4 },
      maxWidth: 1200,
      margin: '0 auto',
      minHeight: '100vh'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 4
      }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: 'primary.main',
            fontWeight: 600,
            borderBottom: '2px solid',
            borderColor: 'primary.light',
            pb: 1,
            display: 'inline-block'
          }}
        >
          User Submission Management
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{
            mt: { xs: 2, md: 0 },
            borderRadius: 50,
            px: 3,
            color:'primary',
            bgcolor: 'success.main',
            '&:hover': { bgcolor: 'success.dark' }
          }}
          startIcon={<ExpandMoreIcon />}
        >
          Return to List
        </Button>
      </Box>

      {groups.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            bgcolor: '#fff3e0'
          }}
        >
          <Typography variant="h6" color="textSecondary">
            No management group available
          </Typography>
        </Paper>
      ) : (
        groups.map((group) => (
          <Accordion
            key={group.groupId}
            sx={{
              mb: 2,
              borderRadius: 2,
              boxShadow: `0 2px 8px ${theme.palette.grey[200]}`,
              '&.Mui-expanded': {
                margin: 'auto'
              }
            }}
            elevation={0}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}
              sx={{
                bgcolor: '#f8f9fa',
                borderRadius: '8px 8px 0 0',
                borderBottom: `1px solid ${theme.palette.divider}`,
                minHeight: 64,
                '&.Mui-expanded': {
                  minHeight: 64
                }
              }}
            >
              <Box sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                px: 2
              }}>
                <Typography
                  variant="h6"
                  sx={{
                    flex: 1,
                    fontWeight: 500,
                    color: 'primary.dark'
                  }}
                >
                  {group.groupName}
                </Typography>
                <Chip
                  label={`${group.members.length} members`}
                  variant="outlined"
                  sx={{
                    mr: 2,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    borderColor: 'primary.light'
                  }}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0 }}>
              {group.members.map((member) => (
                <Accordion
                  key={member.userId}
                  sx={{
                    boxShadow: 'none',
                    bgcolor: 'transparent',
                    '&:before': { display: 'none' },
                    '&.Mui-expanded': {
                      margin: 0
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: 'success.main' }} />}
                    sx={{
                      bgcolor: '#f1f8e9',
                      minHeight: 56,
                      borderRadius: '0 0 8px 8px',
                      borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                  >
                    <Box sx={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      px: 2
                    }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          flex: 1,
                          fontWeight: 500,
                          color: 'success.dark'
                        }}
                      >
                        {member.userName}
                      </Typography>
                      <Chip
                        label={`${member.submissions.length} submissions`}
                        color="success"
                        size="small"
                        sx={{
                          mr: 2,
                          bgcolor: 'success.light',
                          color: 'success.contrastText'
                        }}
                      />
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 2 }}>
                    {member.submissions.length === 0 ? (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        No submission records found
                      </Typography>
                    ) : (
                      <List dense disablePadding>
                        {member.submissions.map((submission) => (
                          <ListItem
                            key={submission.questionnaireId}
                            disableGutters
                            sx={{
                              borderRadius: 1,
                              my: 0.5,
                              transition: 'all 0.2s',
                              '&:hover': {
                                bgcolor: 'primary.light',
                                cursor: 'pointer',
                                transform: 'translateX(8px)'
                              }
                            }}
                            onClick={() =>
                              handleViewDetails(member.userId, submission.questionnaireId)
                            }
                          >
                            <ListItemText
                              primary={
                                <Typography variant="body1" fontWeight={500}>
                                  {submission.title}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: 'text.disabled',
                                    mt: 0.5
                                  }}
                                >
                                  Submitted: {new Date(
                                    submission.submittedAt
                                  ).toLocaleDateString()}
                                </Typography>
                              }
                              sx={{ px: 2 }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}
                  </AccordionDetails>
                </Accordion>
              ))}
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
}