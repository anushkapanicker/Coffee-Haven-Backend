// routes/orderRoutes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

// Get all orders
router.get("/orders", orderController.getAllOrders);

// Get order by ID
router.get("/orders/:id", orderController.getOrderById);

// Create new order
router.post("/orders", orderController.createOrder);

// Update order
router.patch("/orders/:id", orderController.updateOrder);

// Delete order
router.delete("/orders/:id", orderController.deleteOrder);

module.exports = router;
