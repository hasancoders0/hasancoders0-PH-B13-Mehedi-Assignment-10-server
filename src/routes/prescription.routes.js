const express = require("express");

const {
  createPrescription,
  getDoctorPrescriptions,
  getPatientPrescriptions,
  updatePrescription,
  getPrescriptionById,
} = require("../controllers/prescription.controller");

const router = express.Router();

// Create Prescription
router.post("/", createPrescription);

// Doctor Prescriptions
router.get("/doctor/:email", getDoctorPrescriptions);

// Patient Prescriptions
router.get("/patient/:email", getPatientPrescriptions);

// Single Prescription
router.get("/:id", getPrescriptionById);

// Update Prescription
router.put("/:id", updatePrescription);

module.exports = router;
