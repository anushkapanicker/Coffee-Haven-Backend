const User = require("../models/user");
const Order = require("../models/order");
const Coffee = require("../models/coffee");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json({ message: "Users retrieved successfully", data: users });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving users", error: err.message });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User retrieved successfully", data: user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving user", error: err.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  const { name, email, dob, password } = req.body;

  if (!name || !email || !dob || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = new User({
    name,
    email,
    dob,
    password,
  });

  try {
    const newUser = await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", data: newUser });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating user", error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, dob, password, photo } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (dob) user.dob = dob;
    if (password) user.password = password;
    if (photo) user.photo = photo;

    const updatedUser = await user.save();
    res.json({ message: "User updated successfully", data: updatedUser });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating user", error: err.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne({ _id: req.params.id });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};

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
