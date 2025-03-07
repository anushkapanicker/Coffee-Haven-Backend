// models/order.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  coffee_id: {
    type: Schema.Types.ObjectId,
    ref: "Coffee",
    required: true,
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    min: 1,
  },
  unitPrice: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  address: {
    type: String,
    required: true,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
