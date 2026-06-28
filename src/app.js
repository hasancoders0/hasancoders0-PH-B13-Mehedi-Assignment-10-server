const express = require("express");
const cors = require("cors");

const seedRoutes = require("./routes/seed.routes");
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const doctorRoutes = require("./routes/doctor.routes");
const appointmentRoutes = require("./routes/appointment.routes");
const paymentRoutes = require("./routes/payment.routes");
const adminRoutes = require("./routes/admin.routes");
const prescriptionRoutes = require("./routes/prescription.routes");
const reviewRoutes = require("./routes/review.routes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/seed", seedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/reviews", reviewRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MediCare Connect API is running 🚀",
  });
});

module.exports = app;
