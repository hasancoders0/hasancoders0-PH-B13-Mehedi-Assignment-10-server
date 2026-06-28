const { ObjectId } = require("mongodb");

const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const doctors = await db
      .collection(COLLECTIONS.DOCTORS)
      .find()
      .toArray();

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor ID",
      });
    }

    const db = client.db("medicare-connect");

    const doctor = await db
      .collection(COLLECTIONS.DOCTORS)
      .findOne({
        _id: new ObjectId(id),
      });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      });
    }

    res.status(200).json({
      success: true,
      doctor,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDoctors,
  getDoctorById,
};