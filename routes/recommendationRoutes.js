// routes/recommendationRoutes.js
const express = require("express");
const router = express.Router();
const recommendationController = require("../controllers/recommendationController");

// Get coffee recommendation based on user profile and mood
router.post("/recommend-coffee", recommendationController.recommendCoffee);

module.exports = router;
