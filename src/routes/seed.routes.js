const express = require("express");

const doctors = require("../seeds/doctors.seed");
const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

const router = express.Router();

router.post("/doctors", async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const doctorsCollection = db.collection(
      COLLECTIONS.DOCTORS
    );

    await doctorsCollection.deleteMany({});

    const result = await doctorsCollection.insertMany(
      doctors
    );

    res.json({
      success: true,
      inserted: result.insertedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;