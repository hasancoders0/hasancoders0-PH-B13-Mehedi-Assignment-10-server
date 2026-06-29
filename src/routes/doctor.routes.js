const express = require("express");

const {
  getDoctors,
  getDoctorById,
  getDoctorByEmail,
  getAllDoctors,

  addDoctor,
  deleteDoctor,

  verifyDoctor,
  unverifyDoctor,

  updateDoctorSchedule,
  updateDoctorProfile,
} = require("../controllers/doctor.controller");

const router = express.Router();

// ====================
// Public Routes
// ====================

router.get("/", getDoctors);

router.get("/admin/all", getAllDoctors);

router.get("/email/:email", getDoctorByEmail);

router.get("/:id", getDoctorById);

// ====================
// Doctor Routes
// ====================

router.patch("/:id/profile", updateDoctorProfile);

router.patch("/:id/schedule", updateDoctorSchedule);

// ====================
// Admin Routes
// ====================

router.post("/", addDoctor);

router.patch("/:id/verify", verifyDoctor);

router.patch("/:id/unverify", unverifyDoctor);

router.delete("/:id", deleteDoctor);

module.exports = router;
