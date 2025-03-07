// routes/feedbackRoutes.js
const express = require("express");
const router = express.Router();
const feedbackController = require("../controllers/feedbackController");

// Get all feedback
router.get("/feedback", feedbackController.getAllFeedback);

// Get feedback by ID
router.get("/feedback/:id", feedbackController.getFeedbackById);

// Submit new feedback
router.post("/feedback", feedbackController.submitFeedback);

// Update feedback
router.patch("/feedback/:id", feedbackController.updateFeedback);

// Delete feedback
router.delete("/feedback/:id", feedbackController.deleteFeedback);

module.exports = router;
