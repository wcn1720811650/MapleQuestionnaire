import React, { useEffect, useState } from 'react';
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
  IconButton,
  Checkbox,
  Snackbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const MyCustomerList = ({ open, onClose, onSelect }) => {
  const [customers, setCustomers] = useState([]);
  const [selected, setSelected] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/my-customers', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setCustomers(data);
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

  const handleDelete = async (customerId) => {
    try {
      const response = await fetch(`http://localhost:3001/api/my-customers/${customerId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      if (!response.ok) {
        setSnackbarMessage('Failed to delete customer');
        setSnackbarSeverity('error');
        throw new Error('Failed to delete customer');
      } else {
        setSnackbarMessage('Customer deleted successfully');
        setSnackbarSeverity('success');
        setCustomers(customers.filter((c) => c.id !== customerId));
      }
      setSnackbarOpen(true);
    } catch (err) {
      setSnackbarMessage(err.message || 'Failed to delete customer');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      setError(err.message);
    }
  };

  const handleSelect = (customerId) => {
    if (selected.includes(customerId)) {
      setSelected(selected.filter((id) => id !== customerId));
    } else {
      setSelected([...selected, customerId]); 
    }
  };

  const handleConfirmSelection = () => {
    const selectedCustomers = customers.filter((c) => selected.includes(c.id));
    onSelect(selectedCustomers); 
    onClose(); 
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Select Customers</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < customers.length
                      }
                      checked={selected.length === customers.length}
                      onChange={() =>
                        setSelected(
                          selected.length === customers.length
                            ? []
                            : customers.map((c) => c.id)
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(customer.id)}
                        onChange={() => handleSelect(customer.id)}
                      />
                    </TableCell>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleConfirmSelection}>
          Confirm Selection
        </Button>
      </DialogActions>
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
    </Dialog>
  );
};

export default MyCustomerList;