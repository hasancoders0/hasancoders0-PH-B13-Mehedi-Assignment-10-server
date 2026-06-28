const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  confirmPayment,
  getAppointmentById,
} = require("../controllers/appointment.controller");

const router = express.Router();

router.post("/", createAppointment);

router.get("/patient/:email", getMyAppointments);

router.patch("/:id/cancel", cancelAppointment);

router.patch("/:id/pay", confirmPayment);

router.get("/:id", getAppointmentById);

module.exports = router;
