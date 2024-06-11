import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Grid,
} from '@mui/material';
import { styled } from '@mui/system';

const RootContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
}));

const FormControl = styled(Grid)(({ theme }) => ({
  margin: theme.spacing(2),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(4),
}));

const Campaign = () => {
  const [rules, setRules] = useState({
    totalSpends: { operator: '>', value: 10000 },
    visits: { operator: '<=', value: 3 },
    lastVisit: { operator: '>', value: '2023-03-09' },
  });
  const [logs, setLogs] = useState([]);

  const handleRuleChange = (field, value) => {
    setRules((prevRules) => ({
      ...prevRules,
      [field]: {
        ...prevRules[field],
        value,
      },
    }));
  };

  const handleSendCampaign = async () => {
    try {
      const rulesArray = Object.keys(rules).map((key) => ({
        field: key,
        operator: rules[key].operator,
        value: rules[key].value,
      }));
      await axios.post('/api/campaigns', { rules: rulesArray });
      alert('Campaign messages sent successfully');
      fetchCommunicationLogs();
    } catch (error) {
      console.error('Error sending campaign:', error);
      alert('Failed to send campaign messages');
    }
  };

  const fetchCommunicationLogs = async () => {
    try {
      const response = await axios.get('/api/communication-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching communication logs:', error);
    }
  };

  useEffect(() => {
    fetchCommunicationLogs();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <RootContainer>
      <Typography variant="h4" gutterBottom>
        Send Campaign
      </Typography>
      <Grid container spacing={3}>
        <FormControl item xs={12} sm={4}>
          <TextField
            label="Total Spends (>)"
            type="number"
            fullWidth
            value={rules.totalSpends.value}
            onChange={(e) => handleRuleChange('totalSpends', e.target.value)}
          />
        </FormControl>
        <FormControl item xs={12} sm={4}>
          <TextField
            label="Visits (<=)"
            type="number"
            fullWidth
            value={rules.visits.value}
            onChange={(e) => handleRuleChange('visits', e.target.value)}
          />
        </FormControl>
        <FormControl item xs={12} sm={4}>
          <TextField
            label="Last Visit (>)"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={rules.lastVisit.value}
            onChange={(e) => handleRuleChange('lastVisit', e.target.value)}
          />
        </FormControl>
        <Grid item xs={12} sm={4} >
        <StyledButton
        variant="contained"
        color="primary"
        onClick={handleSendCampaign}
      >
        Send Request
      </StyledButton>
      </Grid>
      </Grid>
      

      <Typography variant="h5" gutterBottom>
        Communication Logs
      </Typography>
      <Paper>
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Customer Name</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log.customerId.name}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.status}</TableCell>
                <TableCell>{formatDate(log.sentAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </Paper>
    </RootContainer>
  );
};

export default Campaign;
