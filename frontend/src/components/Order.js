import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';

axios.defaults.baseURL = 'http://localhost:3001';

const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const BackButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <RootContainer>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <BackButton
        variant="contained"
        color="primary"
        component={Link}
        to="/dashboard"
      >
        Back to Dashboard
      </BackButton>
      <Paper>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Amount Spent</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{formatDate(order.date)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Paper>
    </RootContainer>
  );
};

export default Orders;
