const express = require("express");

const {
  createDoctorRequest,
  getDoctorRequestByEmail,
  getAllDoctorRequests,
  approveDoctorRequest,
  rejectDoctorRequest,
} = require("../controllers/doctorRequest.controller");

const router = express.Router();

// Patient submits doctor application
router.post("/", createDoctorRequest);

// Patient checks own application
router.get(
  "/email/:email",
  getDoctorRequestByEmail
);

// Admin gets all applications
router.get("/", getAllDoctorRequests);

// Admin actions
router.patch(
  "/:id/approve",
  approveDoctorRequest
);

router.patch(
  "/:id/reject",
  rejectDoctorRequest
);

module.exports = router;