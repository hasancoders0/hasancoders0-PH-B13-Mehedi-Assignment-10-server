const express = require("express");

const {
  createPrescription,
  getPatientPrescriptions,
} = require("../controllers/prescription.controller");

const router = express.Router();

router.post("/", createPrescription);

router.get(
  "/patient/:email",
  getPatientPrescriptions
);

module.exports = router;