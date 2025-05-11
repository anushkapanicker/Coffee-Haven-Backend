const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Get all users
router.get("/users", userController.getAllUsers);

// Get user by ID
router.get("/users/:id", userController.getUserById);

// User registration
router.post("/auth/register", userController.createUser);

// User login
router.post("/auth/login", userController.loginUser);

// Update user
router.patch("/users/:id", userController.updateUser);

// Delete user
router.delete("/users/:id", userController.deleteUser);

module.exports = router;
