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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Checkbox,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';

const MyGroup = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedCustomers, setSelectedCustomers] = useState([]); 

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
    setSelectedCustomers([]); 
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedGroup(null);
  };

  const handleCheckboxChange = (customerId) => {
    setSelectedCustomers((prevSelected) => {
      if (prevSelected.includes(customerId)) {
        return prevSelected.filter((id) => id !== customerId); 
      } else {
        return [...prevSelected, customerId]; 
      }
    });
  };

  const handleRemoveSelectedCustomers = async () => {
    if (selectedCustomers.length === 0) {
      alert('Please select at least one customer to remove.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }

      await axios.post(
        `/api/groups/${selectedGroup.id}/remove-customers`,
        { customerIds: selectedCustomers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchGroups();
      setSelectedGroup((prevGroup) => ({
        ...prevGroup,
        customers: prevGroup.customers.filter((c) => !selectedCustomers.includes(c.id)),
      }));
  
      setSelectedCustomers([]);
    } catch (err) {
      console.error('Error removing customers:', err);
      alert('Failed to remove customers from the group.');
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
            <ListItem
              key={group.id}
              divider
              button
              onClick={() => handleOpenDialog(group)}
              sx={{ 
                p: 2, 
                mb: 2,
                backgroundImage: 'linear-gradient(to right, #ffffff, #9AC89A, #4B9B4B)',
                borderRadius: 2,
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
              <ListItemText
                primary={group.name}
                fontWeight="bold"
                sx={{ cursor: 'pointer' }}
                variant="subtitle1"
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
                <DeleteIcon sx={{ color: red[500] }} />
              </IconButton>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Group Members</DialogTitle>
        <DialogContent>
          {selectedGroup && (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={
                          selectedCustomers.length > 0 &&
                          selectedCustomers.length < selectedGroup.customers.length
                        }
                        checked={
                          selectedCustomers.length === selectedGroup.customers.length &&
                          selectedGroup.customers.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCustomers(selectedGroup.customers.map((c) => c.id)); 
                          } else {
                            setSelectedCustomers([]); 
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedGroup.customers.length > 0 ? (
                    selectedGroup.customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={selectedCustomers.includes(customer.id)}
                            onChange={() => handleCheckboxChange(customer.id)}
                          />
                        </TableCell>
                        <TableCell>{customer.name || 'Unknown'}</TableCell>
                        <TableCell>{customer.email || 'No email available'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No members in this group.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="error"
            disabled={selectedCustomers.length === 0}
            onClick={handleRemoveSelectedCustomers}
          >
            Remove Selected
          </Button>
          <Button onClick={handleCloseDialog} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyGroup;