import React, { useState } from 'react';
import { Container, Button, Alert } from '@mui/material';
import CustomerList from './CustomerList';
import MyCustomerList from './MyCustomerList';

const Customer = ({ role }) => {
  const [customers, setCustomers] = useState([]);
  const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
  const [openMyCustomerDialog, setOpenMyCustomerDialog] = useState(false);

  return (
    <Container>
      {role !== 'manager' ? (
        <Alert severity="warning" sx={{ mb: 2 }}>
          You do not have permission to manage customers.
        </Alert>
      ) : null}
      <Button disabled={role !== 'manager'} sx={{marginRight:10, backgroundColor:'#4B9B4B' }} variant="contained" onClick={() => setOpenCustomerDialog(true)}>Query Customer</Button>
      <Button disabled={role !== 'manager'} sx={{backgroundColor:'#4B9B4B' }} variant="contained" onClick={() => setOpenMyCustomerDialog(true)}>My Customer</Button>

      <CustomerList open={openCustomerDialog} onClose={() => setOpenCustomerDialog(false)} onAddCustomer={customer => setCustomers([...customers, customer])} />
      <MyCustomerList open={openMyCustomerDialog} onClose={() => setOpenMyCustomerDialog(false)} customers={customers} />
    </Container>
  );
};

export default Customer;
