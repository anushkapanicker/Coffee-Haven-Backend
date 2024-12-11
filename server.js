const express = require("express");
const mongoose = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
