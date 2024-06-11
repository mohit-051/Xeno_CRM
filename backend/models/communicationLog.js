// models/communicationLog.js
const mongoose = require('mongoose');

const CommunicationLogSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  message: { type: String, required: true },
  status: { type: String, default: 'sent' }, // or any default value you prefer
  sentAt: { type: Date, default: Date.now },
});

const CommunicationLog = mongoose.model('CommunicationLog', CommunicationLogSchema);

module.exports = CommunicationLog;
