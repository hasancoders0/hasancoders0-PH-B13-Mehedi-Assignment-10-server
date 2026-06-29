const { ObjectId } = require("mongodb");

const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

// Create Prescription
const createPrescription = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const existingPrescription = await db
      .collection(COLLECTIONS.PRESCRIPTIONS)
      .findOne({
        appointmentId: req.body.appointmentId,
      });

    if (existingPrescription) {
      return res.status(400).json({
        success: false,
        message: "Prescription already exists for this appointment.",
      });
    }

    const prescription = {
      appointmentId: req.body.appointmentId,

      doctorId: req.body.doctorId,
      doctorName: req.body.doctorName,
      doctorEmail: req.body.doctorEmail,

      patientName: req.body.patientName,
      patientEmail: req.body.patientEmail,

      diagnosis: req.body.diagnosis,
      medications: req.body.medications,
      notes: req.body.notes,

      createdAt: new Date(),
    };

    const result = await db
      .collection(COLLECTIONS.PRESCRIPTIONS)
      .insertOne(prescription);

    await db.collection(COLLECTIONS.APPOINTMENTS).updateOne(
      {
        _id: new ObjectId(prescription.appointmentId),
      },
      {
        $set: {
          hasPrescription: true,
          prescriptionId: result.insertedId.toString(),
          prescriptionCreatedAt: new Date(),
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

// Doctor Prescriptions
const getDoctorPrescriptions = async (req, res) => {
  try {
    const { email } = req.params;

    const db = client.db("medicare-connect");

    const prescriptions = await db
      .collection(COLLECTIONS.PRESCRIPTIONS)
      .find({
        doctorEmail: email,
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

// Update Prescription
const updatePrescription = async (req, res) => {
  try {
    const { id } = req.params;

    const { diagnosis, medications, notes } = req.body;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.PRESCRIPTIONS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          diagnosis,
          medications,
          notes,
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
  getDoctorPrescriptions,
  getPatientPrescriptions,
  updatePrescription,
  getPrescriptionById,
};
