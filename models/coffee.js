// models/coffee.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const coffeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  moods: {
    type: [String],
    default: [],
  },
  zodiacSigns: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    required: true,
  },
});

const Coffee = mongoose.model("Coffee", coffeeSchema);

module.exports = Coffee;
