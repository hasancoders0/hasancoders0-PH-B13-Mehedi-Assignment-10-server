const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

const createAppointment = async (req, res) => {
  try {
    const appointment = req.body;

    const db = client.db("medicare-connect");

    const result = await db
      .collection(COLLECTIONS.APPOINTMENTS)
      .insertOne({
        ...appointment,
        status: "pending",
        paymentStatus: "unpaid",
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

const getMyAppointments = async (req, res) => {
  try {
    const email = req.params.email;

    const db = client.db("medicare-connect");

    const appointments = await db
      .collection(COLLECTIONS.APPOINTMENTS)
      .find({
        patientEmail: email,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createAppointment,
  getMyAppointments,
};