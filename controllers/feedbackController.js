// controllers/feedbackController.js
const Feedback = require("../models/feedback");

// Get all feedback entries
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ submittedAt: -1 });
    res.json({ message: "Feedback retrieved successfully", data: feedback });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving feedback", error: err.message });
  }
};

// Get feedback by ID
exports.getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.json({ message: "Feedback retrieved successfully", data: feedback });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving feedback", error: err.message });
  }
};

// Submit new feedback
exports.submitFeedback = async (req, res) => {
  const {
    overallRating,
    name,
    email,
    recommendationSystemRating,
    moodDetectionAccurate,
    detailedFeedback,
    featureSuggestions,
  } = req.body;

  // Validate required fields
  if (
    !overallRating ||
    !name ||
    !email ||
    !recommendationSystemRating ||
    moodDetectionAccurate === undefined
  ) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const feedback = new Feedback({
    overallRating,
    name,
    email,
    recommendationSystemRating,
    moodDetectionAccurate,
    detailedFeedback: detailedFeedback || "",
    featureSuggestions: featureSuggestions || "",
  });

  try {
    const newFeedback = await feedback.save();
    res
      .status(201)
      .json({ message: "Feedback submitted successfully", data: newFeedback });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error submitting feedback", error: err.message });
  }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const {
      overallRating,
      name,
      email,
      recommendationSystemRating,
      moodDetectionAccurate,
      detailedFeedback,
      featureSuggestions,
    } = req.body;

    if (overallRating !== undefined) feedback.overallRating = overallRating;
    if (name) feedback.name = name;
    if (email) feedback.email = email;
    if (recommendationSystemRating)
      feedback.recommendationSystemRating = recommendationSystemRating;
    if (moodDetectionAccurate !== undefined)
      feedback.moodDetectionAccurate = moodDetectionAccurate;
    if (detailedFeedback !== undefined)
      feedback.detailedFeedback = detailedFeedback;
    if (featureSuggestions !== undefined)
      feedback.featureSuggestions = featureSuggestions;

    const updatedFeedback = await feedback.save();
    res.json({
      message: "Feedback updated successfully",
      data: updatedFeedback,
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating feedback", error: err.message });
  }
};

// Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    await Feedback.deleteOne({ _id: req.params.id });
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting feedback", error: err.message });
  }
};
