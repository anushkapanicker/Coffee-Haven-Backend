// models/feedback.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedbackSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  recommendation: {
    type: Boolean,
    required: true,
  },
  feedback: {
    type: String,
    default: "",
  },
  improvements: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;
