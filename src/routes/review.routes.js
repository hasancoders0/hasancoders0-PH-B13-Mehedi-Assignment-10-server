const express = require("express");

const {
  createReview,
  getReviewByAppointment,
  getDoctorReviews,
  getPatientReviews,
  updateReview,
  deleteReview,
  getReviewById,
} = require("../controllers/review.controller");

const router = express.Router();

// Create Review
router.post("/", createReview);

// Get Review By Appointment
router.get("/appointment/:appointmentId", getReviewByAppointment);

// Doctor Reviews
router.get("/doctor/:doctorId", getDoctorReviews);

// Patient Reviews
router.get("/patient/:email", getPatientReviews);

// Update Review
router.put("/:id", updateReview);

// Delete Review
router.delete("/:id", deleteReview);

router.get("/:id", getReviewById);

module.exports = router;
