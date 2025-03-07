// routes/coffeeRoutes.js
const express = require("express");
const router = express.Router();
const coffeeController = require("../controllers/coffeeController");

// Get all coffees
router.get("/coffees", coffeeController.getAllCoffees);

// Get coffee by ID
router.get("/coffees/:id", coffeeController.getCoffeeById);

// Create new coffee
router.post("/coffees", coffeeController.createCoffee);

// Update coffee
router.patch("/coffees/:id", coffeeController.updateCoffee);

// Delete coffee
router.delete("/coffees/:id", coffeeController.deleteCoffee);

module.exports = router;
