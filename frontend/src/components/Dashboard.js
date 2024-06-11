import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { styled } from '@mui/system';

axios.defaults.baseURL = 'http://localhost:3001';

const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const Dashboard = () => {
  const [customers, setCustomers] = useState([]);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: '', email: '', totalSpends: 0, visits: 0, lastVisit: '' });
  const [newOrder, setNewOrder] = useState({ amount: 0, order_date: '' });
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/api/customers');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/customers', newCustomer);
      setShowCustomerForm(false);
      setNewCustomer({ name: '', email: '', totalSpends: 0, visits: 0, lastVisit: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Error adding customer:', error);
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/orders', { customer_id: selectedCustomerId, amount: newOrder.amount, order_date: newOrder.order_date });
      setShowOrderForm(false);
      setNewOrder({ amount: 0, order_date: '' });
      fetchCustomers();
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const calculateTotalVisits = (customer) => customer.visits || 0;
  const calculateMaxMoneySpent = (customer) => customer.totalSpends || 0;

  return (
    <RootContainer>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={() => setShowCustomerForm(true)}
          >
            Add Customer
          </StyledButton>
        </Grid>
        <Grid item>
          <StyledButton
            variant="contained"
            color="secondary"
            component={Link}
            to="/orders"
          >
            View Orders
          </StyledButton>
        </Grid>
        <Grid item>
          <StyledButton
            variant="contained"
            color="secondary"
            component={Link}
            to="/campaign"
          >
            Send Campaign
          </StyledButton>
        </Grid>
      </Grid>

      <Paper>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Customer ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Total Visits</TableCell>
              <TableCell>Max Money Spent</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                <TableCell>{customer._id}</TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{calculateTotalVisits(customer)}</TableCell>
                <TableCell>{calculateMaxMoneySpent(customer)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => { setSelectedCustomerId(customer._id); setShowOrderForm(true); }}
                  >
                    Make an Order
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Paper>

      <Dialog open={showCustomerForm} onClose={() => setShowCustomerForm(false)}>
        <DialogTitle>Add Customer</DialogTitle>
        <DialogContent>
          <form onSubmit={handleCustomerSubmit}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={newCustomer.name}
              onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={newCustomer.email}
              onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              required
            />
            <TextField
              label="Total Spends"
              type="number"
              fullWidth
              margin="normal"
              value={newCustomer.totalSpends}
              onChange={(e) => setNewCustomer({ ...newCustomer, totalSpends: parseFloat(e.target.value) })}
              required
            />
            <TextField
              label="Visits"
              type="number"
              fullWidth
              margin="normal"
              value={newCustomer.visits}
              onChange={(e) => setNewCustomer({ ...newCustomer, visits: parseInt(e.target.value, 10) })}
              required
            />
            <TextField
              label="Last Visit"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={newCustomer.lastVisit}
              onChange={(e) => setNewCustomer({ ...newCustomer, lastVisit: e.target.value })}
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCustomerForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleCustomerSubmit} color="primary">
            Save Customer
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={showOrderForm} onClose={() => setShowOrderForm(false)}>
        <DialogTitle>Add Order</DialogTitle>
        <DialogContent>
          <form onSubmit={handleOrderSubmit}>
            <TextField
              label="Amount"
              type="number"
              fullWidth
              margin="normal"
              value={newOrder.amount}
              onChange={(e) => setNewOrder({ ...newOrder, amount: parseFloat(e.target.value) })}
              required
            />
            <TextField
              label="Order Date"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={newOrder.order_date}
              onChange={(e) => setNewOrder({ ...newOrder, order_date: e.target.value })}
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOrderForm(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleOrderSubmit} color="primary">
            Save Order
          </Button>
        </DialogActions>
      </Dialog>
    </RootContainer>
  );
};

export default Dashboard;
