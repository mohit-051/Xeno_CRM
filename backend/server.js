const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const amqp = require('amqplib/callback_api');

const Customer = require('./models/customer');
const Order = require('./models/order');
const CommunicationLog = require('./models/communicationLog');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Replace 'your_mongodb_uri' with your actual MongoDB URI
const mongoURI = 'mongodb+srv://meesala050:iWl3W6aTlTVatKgb@cluster0.z1pnfen.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Data ingestion API
app.post('/api/customers', async (req, res) => {
  const customer = new Customer(req.body);
  await customer.save();
  res.send(customer);
});

// Add GET route for fetching all customers
app.get('/api/customers', async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);
});

app.post('/api/orders', async (req, res) => {
  const { customer_id, amount, order_date } = req.body;
  const order = new Order({ customer_id, amount, order_date });
  await order.save();

  // Update customer's total spends and last visit
  await Customer.findByIdAndUpdate(customer_id, {
    $inc: { totalSpends: amount, visits: 1 },
    $set: { lastVisit: order_date }
  });

  res.send(order);
});

app.get('/api/orders', async (req, res) => {
  try {
    // Fetch orders from the 'orders' collection
    const orders = await Order.find();

    // Map over orders to populate customer names and format the output
    const formattedOrders = await Promise.all(orders.map(async order => {
      // Fetch the customer details corresponding to the customer_id
      const customer = await Customer.findById(order.customer_id);

      // If the customer is found, create a formatted order object
      if (customer) {
        return {
          _id: order._id,
          customerName: customer.name, // Populate customer name
          amount: order.amount,
          date: order.order_date
        };
      } else {
        // Handle case where customer is not found
        return {
          _id: order._id,
          customerName: "Unknown", // Or any default value you prefer
          amount: order.amount,
          date: order.order_date
        };
      }
    }));

    // Send the formatted orders as the response
    res.send(formattedOrders);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error fetching orders:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Send campaign API
app.post('/api/campaigns', async (req, res) => {
  const rules = req.body.rules;
  const query = {}; // Build MongoDB query based on rules
  const customers = await Customer.find(query);

  customers.forEach(customer => {
    amqp.connect('amqp://localhost', (error0, connection) => {
      if (error0) throw error0;
      connection.createChannel((error1, channel) => {
        if (error1) throw error1;
        const queue = 'campaigns';
        const msg = JSON.stringify({ customerId: customer._id, message: `Hi ${customer.name}, here is 10% off on your next order` });
        channel.assertQueue(queue, { durable: false });
        channel.sendToQueue(queue, Buffer.from(msg));
      });
    });
  });

  res.send({ message: 'Campaign messages sent' });
});

// Delivery Receipt API
app.post('/api/delivery-receipt', async (req, res) => {
  const { communicationLogId, status } = req.body;
  await CommunicationLog.findByIdAndUpdate(communicationLogId, { status });
  res.send({ message: 'Status updated' });
});

// Fetch communication logs with populated customer details
app.get('/api/communication-logs', async (req, res) => {
  try {
    const logs = await CommunicationLog.find().populate('customerId');
    res.send(logs);
  } catch (error) {
    console.error("Error fetching communication logs:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server
app.listen(3001, () => {
  console.log('Server running on port 3001');
});
