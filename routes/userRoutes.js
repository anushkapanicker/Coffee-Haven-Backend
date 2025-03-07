const express = require("express");
const router = express.Router();
const userController = require("../controllers/orderController");

// Get all users
router.get("/users", userController.getAllUsers);

// Get user by ID
router.get("/users/:id", userController.getUserById);

// Create new user
router.post("/users", userController.createUser);

// Update user
router.patch("/users/:id", userController.updateUser);

// Delete user
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
