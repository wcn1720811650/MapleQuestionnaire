import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Paper,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

export default function CreateGroup() {
  const [groupName, setGroupName] = useState('');
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false); 
  const [snackbarMessage, setSnackbarMessage] = useState(''); 
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); 

  const handleOpenDialog = async () => {
    try {
      const response = await axios.get('/api/my-customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setCustomers(response.data);
      setOpenDialog(true);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setSnackbarMessage('Failed to load customers');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAddCustomer = (customer) => {
    if (!selectedCustomers.some((c) => c.id === customer.id)) {
      setSelectedCustomers([...selectedCustomers, customer]);
    }
  };

  const handleRemoveCustomer = (customerId) => {
    setSelectedCustomers(selectedCustomers.filter((c) => c.id !== customerId));
  };

  const handleSubmitGroup = () => {
    if (!groupName.trim()) {
      setSnackbarMessage('Group name cannot be empty');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }
    if (selectedCustomers.length === 0) {
      setSnackbarMessage('You must select at least one customer');
      setSnackbarSeverity('warning');
      setSnackbarOpen(true);
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setSnackbarMessage('User not logged in or userId is missing');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    const newGroup = {
      name: groupName.trim(),
      customerIds: selectedCustomers.map((c) => c.id),
    };

    console.log('Request Body:', newGroup);

    axios
      .post('/api/groups', newGroup, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        console.log('Group created:', response.data);
        setGroupName('');
        setSelectedCustomers([]);
        setSnackbarMessage('Group created successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch((error) => {
        console.error('Error creating group:', error.response?.data || error.message);
        setSnackbarMessage('Failed to create group');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create Group
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Group Name"
          variant="outlined"
          fullWidth
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Selected Customers:
        </Typography>
        {selectedCustomers.length === 0 ? (
          <Typography>No customers selected.</Typography>
        ) : (
          selectedCustomers.map((customer) => (
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
              <Typography>{customer.name}</Typography>
              <IconButton onClick={() => handleRemoveCustomer(customer.id)}>
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))
        )}
      </Box>
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleOpenDialog}
        sx={{ mb: 2, marginRight: 10, backgroundColor:'#4B9B4B'}}
      >
        Select Customers
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitGroup}
        sx={{ mb: 2, backgroundColor:'#4B9B4B' }}
      >
        Submit Group
      </Button>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle >Select Customers</DialogTitle>
        <DialogContent>
          {customers.length === 0 ? (
            <Typography>No customers available.</Typography>
          ) : (
            customers.map((customer) => (
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
                <Typography>{customer.name}</Typography>
                <Typography>{customer.email}</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => handleAddCustomer(customer)}
                >
                  Add
                </Button>
              </Paper>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}