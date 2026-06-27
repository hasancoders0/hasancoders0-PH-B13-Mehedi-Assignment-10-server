const express = require("express");
const cors = require("cors");

const seedRoutes = require("./routes/seed.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/seed", seedRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MediCare Connect API is running 🚀",
  });
});

module.exports = app;