// consumer.js
const amqp = require('amqplib/callback_api');
const mongoose = require('mongoose');
const CommunicationLog = require('./models/communicationLog');

mongoose.connect('mongodb://localhost:27017/crm_db', { useNewUrlParser: true, useUnifiedTopology: true });

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) throw error0;
  connection.createChannel((error1, channel) => {
    if (error1) throw error1;
    const queue = 'campaigns';
    channel.assertQueue(queue, { durable: false });

    channel.consume(queue, async (msg) => {
      const { customerId, message } = JSON.parse(msg.content.toString());
      const communicationLog = new CommunicationLog({ customerId, message, status: 'PENDING', createdAt: new Date() });
      await communicationLog.save();
      
      // Simulate sending and getting delivery receipt
      const status = Math.random() < 0.9 ? 'SENT' : 'FAILED';
      const logId = communicationLog._id;
      // Simulate hitting Delivery Receipt API
      const axios = require('axios');
      await axios.post('http://localhost:3001/api/delivery-receipt', { communicationLogId: logId, status });
    }, { noAck: true });
  });
});
