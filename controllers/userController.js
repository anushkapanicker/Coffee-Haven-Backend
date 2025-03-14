// controllers/userController.js
const User = require("../models/user");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("previousOrders");
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
    const user = await User.findById(req.params.id).populate("previousOrders");
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
  const { name, email, dob, password, photo } = req.body;

  if (!name || !email || !dob || !password) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  const user = new User({
    name,
    email,
    dob,
    password,
    photo: photo || "",
    previousOrders: [],
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
    if (dob) user.dob = new Date(dob);
    if (password) user.password = password;
    if (photo !== undefined) user.photo = photo;

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

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: err.message });
  }
};
