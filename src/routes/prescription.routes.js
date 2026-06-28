const express = require("express");

const {
  createPrescription,
  getPatientPrescriptions,
  getPrescriptionById,
} = require("../controllers/prescription.controller");

const router = express.Router();

router.post("/", createPrescription);

router.get(
  "/patient/:email",
  getPatientPrescriptions
);

router.get(
  "/:id",
  getPrescriptionById
);

module.exports = router;