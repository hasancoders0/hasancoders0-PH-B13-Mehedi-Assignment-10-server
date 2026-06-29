const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");
const { ObjectId } = require("mongodb");

const createAppointment = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const appointment = {
      doctorId: req.body.doctorId,
      doctorName: req.body.doctorName,
      doctorEmail: req.body.doctorEmail,
      specialization: req.body.specialization,

      patientName: req.body.patientName,
      patientEmail: req.body.patientEmail,

      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,

      symptoms: req.body.symptoms,

      consultationFee: Number(req.body.consultationFee),

      status: "pending",
      paymentStatus: "unpaid",

      hasReview: false,
      hasPrescription: false,
      prescriptionId: null,

      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // Prevent double booking
    const existingAppointment = await db
      .collection(COLLECTIONS.APPOINTMENTS)
      .findOne({
        doctorId: appointment.doctorId,

        appointmentDate: appointment.appointmentDate,

        appointmentTime: appointment.appointmentTime,

        status: {
          $ne: "cancelled",
        },
      });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot has already been booked.",
      });
    }

    const result = await db
      .collection(COLLECTIONS.APPOINTMENTS)
      .insertOne(appointment);

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
const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const { transactionId } = req.body;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.APPOINTMENTS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          paymentStatus: "paid",
          status: "confirmed",

          transactionId: transactionId || `TXN-${Date.now()}`,

          paidAt: new Date(),
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

const getAllAppointments = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const appointments = await db
      .collection(COLLECTIONS.APPOINTMENTS)
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
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
const rescheduleAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const { appointmentDate, appointmentTime } = req.body;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.APPOINTMENTS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          appointmentDate,
          appointmentTime,
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
  getAllAppointments,
  rescheduleAppointment,
};
