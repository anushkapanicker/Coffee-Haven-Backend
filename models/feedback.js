// models/feedback.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  recommendationSystemRating: {
    type: String,
    required: true,
    enum: ["Excellent", "Good", "Fair", "Poor"],
  },
  moodDetectionAccurate: {
    type: Boolean,
    required: true,
  },
  detailedFeedback: {
    type: String,
    default: "",
  },
  featureSuggestions: {
    type: String,
    default: "",
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
