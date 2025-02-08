import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';

const CustomerList = ({ open, onClose, onAddCustomer }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchCustomers().finally(() => setLoading(false));
    }
  }, [open]);

  const handleAdd = (customer) => {
    fetch('http://localhost:3001/api/customers/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify({ customerId: customer.id })
    })
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          setSnackbarMessage(data.error || 'Failed to add customer');
          setSnackbarSeverity('error');
        } else {
          setSnackbarMessage('Customer added successfully');
          setSnackbarSeverity('success');
          onAddCustomer(customer); 
          fetchCustomers(); 
        }
        setSnackbarOpen(true);
      })
      .catch(err => {
        setSnackbarMessage(err.message || 'Failed to add customer');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>All Customers</DialogTitle>
        <DialogContent>
          {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Options</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map(customer => (
                    <TableRow key={customer.id}>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>
                        <Button variant="contained" color="success" size="small" onClick={() => handleAdd(customer)}>
                          ADD
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CustomerList;