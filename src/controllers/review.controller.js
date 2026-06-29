const { ObjectId } = require("mongodb");

const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

// Create Review
const createReview = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const review = {
      appointmentId: req.body.appointmentId,

      doctorId: req.body.doctorId,
      doctorName: req.body.doctorName,

      patientName: req.body.patientName,
      patientEmail: req.body.patientEmail,

      rating: Number(req.body.rating),
      comment: req.body.comment,

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const existingReview = await db.collection(COLLECTIONS.REVIEWS).findOne({
      appointmentId: review.appointmentId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "Review already submitted for this appointment.",
      });
    }

    const result = await db.collection(COLLECTIONS.REVIEWS).insertOne(review);

    await db.collection(COLLECTIONS.APPOINTMENTS).updateOne(
      {
        _id: new ObjectId(review.appointmentId),
      },
      {
        $set: {
          hasReview: true,
          reviewId: result.insertedId.toString(),
          reviewCreatedAt: new Date(),
        },
      },
    );

    res.status(201).json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Review By Appointment
const getReviewByAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const db = client.db("medicare-connect");

    const review = await db.collection(COLLECTIONS.REVIEWS).findOne({
      appointmentId,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Doctor Reviews
const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;

    const db = client.db("medicare-connect");

    const reviews = await db
      .collection(COLLECTIONS.REVIEWS)
      .find({
        doctorId,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    const totalReviews = reviews.length;

    const averageRating =
      totalReviews === 0
        ? 0
        : Number(
            (
              reviews.reduce((sum, review) => sum + Number(review.rating), 0) /
              totalReviews
            ).toFixed(1),
          );

    res.json({
      success: true,
      reviews,
      totalReviews,
      averageRating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Patient Reviews
const getPatientReviews = async (req, res) => {
  try {
    const { email } = req.params;

    const db = client.db("medicare-connect");

    const reviews = await db
      .collection(COLLECTIONS.REVIEWS)
      .find({
        patientEmail: email,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.json({
      success: true,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const { rating, comment } = req.body;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.REVIEWS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          rating: Number(rating),
          comment,
          updatedAt: new Date(),
        },
      },
    );

    res.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const review = await db.collection(COLLECTIONS.REVIEWS).findOne({
      _id: new ObjectId(id),
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await db.collection(COLLECTIONS.REVIEWS).deleteOne({
      _id: new ObjectId(id),
    });

    await db.collection(COLLECTIONS.APPOINTMENTS).updateOne(
      {
        _id: new ObjectId(review.appointmentId),
      },
      {
        $set: {
          hasReview: false,
          reviewId: null,
          updatedAt: new Date(),
        },
      },
    );

    res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const review = await db.collection(COLLECTIONS.REVIEWS).findOne({
      _id: new ObjectId(id),
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.json({
      success: true,
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  createReview,
  getReviewByAppointment,
  getReviewById,
  getDoctorReviews,
  getPatientReviews,
  updateReview,
  deleteReview,
};
