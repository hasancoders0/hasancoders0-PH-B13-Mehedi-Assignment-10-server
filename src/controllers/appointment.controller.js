const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

const createAppointment = async (req, res) => {
  try {
    const appointment = req.body;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.APPOINTMENTS).insertOne({
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

const getDoctorAppointments = async (req, res) => {
  try {
    const { email } = req.params;

    const db = client.db("medicare-connect");

    const appointments = await db
      .collection(COLLECTIONS.APPOINTMENTS)
      .find({
        doctorEmail: email,
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
const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.APPOINTMENTS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: "cancelled",
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
const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.APPOINTMENTS).updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          paymentStatus: "paid",
          status: "confirmed",
          paidAt: new Date(),
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

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const appointment = await db.collection(COLLECTIONS.APPOINTMENTS).findOne({
      _id: new ObjectId(id),
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    res.json({
      success: true,
      appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.APPOINTMENTS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status,
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
module.exports = {
  createAppointment,
  getMyAppointments,
  getDoctorAppointments,
  getAppointmentById,
  cancelAppointment,
  confirmPayment,
  updateAppointmentStatus,
};
