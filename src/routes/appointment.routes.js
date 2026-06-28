const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  cancelAppointment,
  confirmPayment,
  getAppointmentById,
  updateAppointmentStatus,
} = require("../controllers/appointment.controller");

const router = express.Router();

router.post("/", createAppointment);

router.get("/patient/:email", getMyAppointments);

router.get("/doctor/:email", getDoctorAppointments);

router.patch("/:id/cancel", cancelAppointment);

router.patch("/:id/pay", confirmPayment);

router.get("/:id", getAppointmentById);

router.patch("/:id/status", updateAppointmentStatus);

module.exports = router;
