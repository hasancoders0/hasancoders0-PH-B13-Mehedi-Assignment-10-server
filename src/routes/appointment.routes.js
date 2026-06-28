const express = require("express");

const {
  createAppointment,
  getMyAppointments,
} = require("../controllers/appointment.controller");

const router = express.Router();

router.post("/", createAppointment);

router.get(
  "/patient/:email",
  getMyAppointments
);

module.exports = router;