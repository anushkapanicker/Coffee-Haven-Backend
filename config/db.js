const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI = "mongodb://localhost:27017/ZodiacBrew";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully to CoffeeHaven"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;
