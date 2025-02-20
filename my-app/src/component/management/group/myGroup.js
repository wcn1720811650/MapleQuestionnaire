import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
const MyGroup = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

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

  const handleOpenDialog = (group) => {
    setSelectedGroup(group);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGroup(null);
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
            <ListItem
              key={group.id}
              divider
              button
              onClick={() => handleOpenDialog(group)}
            >
              <ListItemText
                primary={group.name}
                secondary={`Members: ${group.customers.length}`}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteGroup(group.id);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Group Members</DialogTitle>
        <DialogContent>
          {selectedGroup && selectedGroup.customers.length > 0 ? (
            selectedGroup.customers.map((customer) => (
              <Paper
                key={customer.id}
                sx={{
                  p: 1,
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="body1" fontWeight="bold">
                  {customer.name || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {customer.email || 'No email available'}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography>No members in this group.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyGroup;