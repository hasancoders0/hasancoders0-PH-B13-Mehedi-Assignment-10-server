const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

const createPrescription = async (req, res) => {
  try {
    const prescription = {
      ...req.body,
      createdAt: new Date(),
    };

    const db = client.db("medicare-connect");

    const result = await db
      .collection(COLLECTIONS.PRESCRIPTIONS)
      .insertOne(prescription);

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

module.exports = {
  createPrescription,
  getPatientPrescriptions,
};