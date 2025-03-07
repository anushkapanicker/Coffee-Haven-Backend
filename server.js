const express = require("express");
const mongoose = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const coffeeRoutes = require("./routes/coffeeRoutes");
const orderRoutes = require("./routes/orderRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", userRoutes);
app.use("/api", coffeeRoutes);
app.use("/api", orderRoutes);
app.use("/api", recommendationRoutes);
app.use("/api", feedbackRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
