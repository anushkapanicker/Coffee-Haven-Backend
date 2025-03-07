const Order = require("../models/order");
const Coffee = require("../models/coffee");
const User = require("../models/user");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("coffee_id").populate("user_id");
    res.json({ message: "Orders retrieved successfully", data: orders });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving orders", error: err.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("coffee_id")
      .populate("user_id");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json({ message: "Order retrieved successfully", data: order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving order", error: err.message });
  }
};

// Create new order
exports.createOrder = async (req, res) => {
  const { coffee_id, user_id, qty, address } = req.body;

  if (!coffee_id || !user_id || !qty || !address) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  try {
    // Get coffee to calculate price
    const coffee = await Coffee.findById(coffee_id);
    if (!coffee) {
      return res.status(404).json({ message: "Coffee not found" });
    }

    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const unitPrice = coffee.price;
    const totalPrice = unitPrice * qty;

    const order = new Order({
      coffee_id,
      user_id,
      qty,
      unitPrice,
      totalPrice,
      address,
    });

    const newOrder = await order.save();

    // Update user's previous orders
    await User.findByIdAndUpdate(user_id, {
      $push: { previousOrders: newOrder._id },
    });

    res
      .status(201)
      .json({ message: "Order created successfully", data: newOrder });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating order", error: err.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const { coffee_id, user_id, qty, address } = req.body;

    if (coffee_id) order.coffee_id = coffee_id;
    if (user_id) order.user_id = user_id;
    if (address) order.address = address;

    if (qty) {
      order.qty = qty;
      // Recalculate total price if quantity changes
      const coffee = await Coffee.findById(order.coffee_id);
      if (coffee) {
        order.unitPrice = coffee.price;
        order.totalPrice = coffee.price * qty;
      }
    }

    const updatedOrder = await order.save();
    res.json({ message: "Order updated successfully", data: updatedOrder });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating order", error: err.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Remove order from user's previous orders
    await User.findByIdAndUpdate(order.user_id, {
      $pull: { previousOrders: order._id },
    });

    await Order.deleteOne({ _id: req.params.id });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting order", error: err.message });
  }
};
