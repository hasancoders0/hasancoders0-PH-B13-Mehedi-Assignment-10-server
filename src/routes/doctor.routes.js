const express = require("express");

const {
  getDoctors,
  getDoctorById,
} = require("../controllers/doctor.controller");

const router = express.Router();

router.get("/", getDoctors);
router.get("/:id", getDoctorById);

module.exports = router;