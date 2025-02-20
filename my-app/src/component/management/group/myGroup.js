import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const MyGroup = () => {
  const [groups, setGroups] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        throw new Error('User is not authenticated');
      }

      const response = await axios.get('/api/groups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroups(response.data.groups); 
      setLoading(false);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(err.message || 'Failed to load groups');
      setLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      await axios.delete(`/api/groups/${groupId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setGroups((prevGroups) => prevGroups.filter((group) => group.id !== groupId));
    } catch (err) {
      console.error('Error deleting group:', err);
      alert('Failed to delete group');
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Loading groups...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Groups
      </Typography>

      {groups.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          You have no groups yet.
        </Typography>
      ) : (
        <List>
          {groups.map((group) => (
            <ListItem key={group.id} divider>
              <ListItemText
                primary={group.name}
                secondary={`Members: ${group.customers.length}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit">
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDeleteGroup(group.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button variant="contained" color="primary" href="/create-group">
          Create New Group
        </Button>
      </Box>
    </Box>
  );
};

export default MyGroup;