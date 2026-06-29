const { ObjectId } = require("mongodb");

const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

// Get all doctors
const getDoctors = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const doctors = await db.collection(COLLECTIONS.DOCTORS).find().toArray();

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

    const doctor = await db.collection(COLLECTIONS.DOCTORS).findOne({
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
const getAllDoctors = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const doctors = await db
      .collection(COLLECTIONS.DOCTORS)
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addDoctor = async (req, res) => {
  try {
    const doctor = req.body;

    const db = client.db("medicare-connect");

    await db.collection(COLLECTIONS.DOCTORS).insertOne({
      ...doctor,

      verificationStatus: "verified",
      verifiedAt: new Date(),

      createdAt: new Date(),
    });

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

const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.DOCTORS).deleteOne({
      _id: new ObjectId(id),
    });

    res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDoctorSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const { availableDays, availableTimes } = req.body;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.DOCTORS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          availableDays,
          availableTimes,
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

const getDoctorByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const db = client.db("medicare-connect");

    const doctor = await db.collection(COLLECTIONS.DOCTORS).findOne({
      email,
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
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      specialization,
      qualification,
      hospital,
      experience,
      consultationFee,
      photoURL,
      about,
    } = req.body;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.DOCTORS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          name,
          specialization,
          qualification,
          hospital,
          experience,
          consultationFee: Number(consultationFee),
          photoURL,
          about,
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({
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
const verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.DOCTORS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          verificationStatus: "verified",
          verifiedAt: new Date(),
          updatedAt: new Date(),
        },
      },
    );

    res.status(200).json({
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

const unverifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.DOCTORS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          verificationStatus: "pending",
          updatedAt: new Date(),
        },
        $unset: {
          verifiedAt: "",
        },
      },
    );

    res.status(200).json({
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
module.exports = {
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
};
