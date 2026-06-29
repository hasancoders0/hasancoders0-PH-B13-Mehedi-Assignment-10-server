const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  cancelAppointment,
  confirmPayment,
  updateAppointmentStatus,
  getAllAppointments,
  rescheduleAppointment,
} = require("../controllers/appointment.controller");

const router = express.Router();

router.post("/", createAppointment);

router.get("/patient/:email", getMyAppointments);

router.get("/doctor/:email", getDoctorAppointments);

router.patch("/:id/cancel", cancelAppointment);

router.patch("/:id/pay", confirmPayment);

router.get("/admin/all", getAllAppointments);

router.get("/:id", getAppointmentById);

router.patch("/:id/status", updateAppointmentStatus);

router.patch("/:id/reschedule", rescheduleAppointment);

module.exports = router;
