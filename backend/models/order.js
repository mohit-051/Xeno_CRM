// models/order.js
const mongoose = require('mongoose');
const OrderSchema = new mongoose.Schema({
  customer_id: mongoose.Schema.Types.ObjectId, // Match the request field name
  amount: Number,
  order_date: Date, // Match the request field name
});

module.exports = mongoose.model('Order', OrderSchema);
