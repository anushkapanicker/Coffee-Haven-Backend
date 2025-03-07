const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  photo: {
    type: String,
    default: "",
  },
  previousOrders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
