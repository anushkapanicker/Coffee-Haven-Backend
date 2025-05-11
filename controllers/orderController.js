const Order = require("../models/order");
const Coffee = require("../models/coffee");
const User = require("../models/user");

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.coffee_id")
      .populate("user_id");
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
      .populate("items.coffee_id")
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
  const { items, user_id } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0 || !user_id) {
    return res.status(400).json({ message: "Required fields missing or invalid" });
  }

  try {
    let totalPrice = 0;

    // Validate items and calculate total price
    for (const item of items) {
      const { coffee_id, qty } = item;

      if (!coffee_id || !qty || qty < 1) {
        return res.status(400).json({ message: "Invalid item details" });
      }

      const coffee = await Coffee.findById(coffee_id);
      if (!coffee) {
        return res.status(404).json({ message: `Coffee with ID ${coffee_id} not found` });
      }

      item.unitPrice = coffee.price;
      totalPrice += coffee.price * qty;
    }

    // Check if user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = new Order({
      items,
      user_id,
      totalPrice,
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

    const { items, user_id } = req.body;

    if (items && Array.isArray(items)) {
      let totalPrice = 0;

      // Validate items and calculate total price
      for (const item of items) {
        const { coffee_id, qty } = item;

        if (!coffee_id || !qty || qty < 1) {
          return res.status(400).json({ message: "Invalid item details" });
        }

        const coffee = await Coffee.findById(coffee_id);
        if (!coffee) {
          return res.status(404).json({ message: `Coffee with ID ${coffee_id} not found` });
        }

        item.unitPrice = coffee.price;
        totalPrice += coffee.price * qty;
      }

      order.items = items;
      order.totalPrice = totalPrice;
    }

    if (user_id) {
      order.user_id = user_id;
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