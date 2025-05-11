const Feedback = require("../models/feedback");

// Get all feedback entries
exports.getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ _id: -1 });
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
  const { name, email, experience, recommendation, feedback, improvements, rating } = req.body;

  // Validate required fields
  if (!name || !email || !experience || recommendation === undefined || !rating) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const newFeedback = new Feedback({
    name,
    email,
    experience,
    recommendation,
    feedback: feedback || "",
    improvements: improvements || "",
    rating,
  });

  try {
    const savedFeedback = await newFeedback.save();
    res
      .status(201)
      .json({ message: "Feedback submitted successfully", data: savedFeedback });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error submitting feedback", error: err.message });
  }
};

// Update feedback
exports.updateFeedback = async (req, res) => {
  try {
    const feedbackData = await Feedback.findById(req.params.id);
    if (!feedbackData) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    const { name, email, experience, recommendation, feedback, improvements, rating } = req.body;

    if (name) feedback.name = name;
    if (email) feedback.email = email;
    if (experience) feedback.experience = experience;
    if (recommendation !== undefined) feedback.recommendation = recommendation;
    if (feedback!== undefined) feedback.feedback = feedback;
    if (improvements !== undefined) feedback.improvements = improvements;
    if (rating !== undefined) feedback.rating = rating;

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