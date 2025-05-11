const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password") // Exclude password field
      .populate("previousOrders");
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
    const user = await User.findById(req.params.id)
      .select("-password") // Exclude password field
      .populate("previousOrders");
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

// Create new user (Register)
exports.createUser = async (req, res) => {
  const { fullName, email, dateOfBirth, password, mood } = req.body;

  if (!fullName || !email || !dateOfBirth || !password) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const user = new User({
      fullName,
      email,
      dateOfBirth,
      password,
      mood: mood || "",
      previousOrders: [],
    });

    const newUser = await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      process.env.JWT_SECRET || "coffee_haven_secret_key",
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User created successfully",
      data: {
        user: {
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          mood: newUser.mood,
        },
        token,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating user", error: err.message });
  }
};

// User login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare passwords
    const isPasswordValid = password === user.password;
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "coffee_haven_secret_key",
      { expiresIn: "24h" }
    );

    // Return user data and token
    res.json({
      message: "Login successful",
      data: {
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          mood: user.mood,
        },
        token,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { fullName, email, dateOfBirth, password, mood } = req.body;

    if (fullName) user.fullName = fullName;
    if (email) user.email = email;
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (password) {
      // Hash the new password before saving
      user.password = await bcrypt.hash(password, 10);
    }
    if (mood !== undefined) user.mood = mood;

    const updatedUser = await user.save();
    res.json({
      message: "User updated successfully",
      data: {
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        mood: updatedUser.mood,
      },
    });
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