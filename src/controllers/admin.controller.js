const { ObjectId } = require("mongodb");

const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const usersCollection = db.collection(COLLECTIONS.USERS);
    const doctorsCollection = db.collection(COLLECTIONS.DOCTORS);
    const appointmentsCollection = db.collection(COLLECTIONS.APPOINTMENTS);

    const totalUsers = await usersCollection.countDocuments();

    const totalDoctors = await doctorsCollection.countDocuments();

    const totalAppointments = await appointmentsCollection.countDocuments();

    const totalPaidAppointments = await appointmentsCollection.countDocuments({
      paymentStatus: "paid",
    });

    const totalPendingAppointments =
      await appointmentsCollection.countDocuments({
        status: "pending",
      });

    const totalCancelledAppointments =
      await appointmentsCollection.countDocuments({
        status: "cancelled",
      });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        totalPaidAppointments,
        totalPendingAppointments,
        totalCancelledAppointments,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const users = await db
      .collection(COLLECTIONS.USERS)
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const makeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.USERS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          role: "admin",
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
  getDashboardStats,
  getAllUsers,
  makeAdmin,
};
