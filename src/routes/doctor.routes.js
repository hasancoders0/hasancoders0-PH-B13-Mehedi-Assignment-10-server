const express = require("express");

const {
  getDoctors,
  getDoctorById,
  getAllDoctors,
  addDoctor,
  deleteDoctor,
} = require("../controllers/doctor.controller");

const router = express.Router();

// Public routes
router.get("/", getDoctors);

router.get("/admin/all", getAllDoctors);

// IMPORTANT: dynamic route always LAST
router.get("/:id", getDoctorById);

// Admin routes
router.post("/", addDoctor);

router.delete("/:id", deleteDoctor);

module.exports = router;