const express = require("express");

const {
  createReview,
  getDoctorReviews,
  getPatientReviews,
  updateReview,
  deleteReview,
} = require("../controllers/review.controller");

const router = express.Router();

router.post("/", createReview);

router.get(
  "/doctor/:doctorId",
  getDoctorReviews
);

router.get(
  "/patient/:email",
  getPatientReviews
);

router.put(
  "/:id",
  updateReview
);

router.delete(
  "/:id",
  deleteReview
);

module.exports = router;