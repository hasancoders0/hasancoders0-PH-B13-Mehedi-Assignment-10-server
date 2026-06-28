const { ObjectId } = require("mongodb");

const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

// Create Prescription
const createPrescription = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const prescription = {
      appointmentId: req.body.appointmentId,

      doctorId: req.body.doctorId,
      doctorName: req.body.doctorName,
      doctorEmail: req.body.doctorEmail,

      patientName: req.body.patientName,
      patientEmail: req.body.patientEmail,

      diagnosis: req.body.diagnosis,
      medicines: req.body.medicines,
      advice: req.body.advice,

      createdAt: new Date(),
    };

    // Save prescription
    const result = await db
      .collection(COLLECTIONS.PRESCRIPTIONS)
      .insertOne(prescription);

    // Update appointment
    await db.collection(COLLECTIONS.APPOINTMENTS).updateOne(
      {
        _id: new ObjectId(prescription.appointmentId),
      },
      {
        $set: {
          hasPrescription: true,
          prescriptionCreatedAt: new Date(),
        },
      },
    );

    res.status(201).json({
      success: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Patient Prescriptions
const getPatientPrescriptions = async (req, res) => {
  try {
    const { email } = req.params;

    const db = client.db("medicare-connect");

    const prescriptions = await db
      .collection(COLLECTIONS.PRESCRIPTIONS)
      .find({
        patientEmail: email,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.json({
      success: true,
      prescriptions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Single Prescription
const getPrescriptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const prescription = await db
      .collection(COLLECTIONS.PRESCRIPTIONS)
      .findOne({
        _id: new ObjectId(id),
      });

    if (!prescription) {
      return res.status(404).json({
        success: false,
        message: "Prescription not found",
      });
    }

    res.json({
      success: true,
      prescription,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPrescription,
  getPatientPrescriptions,
  getPrescriptionById,
};
