const { ObjectId } = require("mongodb");

const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const usersCollection = db.collection(COLLECTIONS.USERS);
    const doctorsCollection = db.collection(COLLECTIONS.DOCTORS);
    const appointmentsCollection = db.collection(COLLECTIONS.APPOINTMENTS);
    const reviewsCollection = db.collection(COLLECTIONS.REVIEWS);

    const totalUsers = await usersCollection.countDocuments();

    const totalDoctors = await doctorsCollection.countDocuments();

    // Better patient count
    const totalPatients = await usersCollection.countDocuments({
      role: "patient",
      status: { $ne: "deleted" },
    });

    const totalAppointments = await appointmentsCollection.countDocuments();

    const completedAppointments = await appointmentsCollection.countDocuments({
      status: "completed",
    });

    const pendingAppointments = await appointmentsCollection.countDocuments({
      status: "pending",
    });

    const cancelledAppointments = await appointmentsCollection.countDocuments({
      status: "cancelled",
    });

    const paidAppointments = await appointmentsCollection
      .find({
        paymentStatus: "paid",
      })
      .toArray();

    const totalRevenue = paidAppointments.reduce(
      (sum, item) => sum + Number(item.consultationFee || 0),
      0,
    );

    const totalReviews = await reviewsCollection.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalPatients,
        totalAppointments,
        completedAppointments,
        pendingAppointments,
        cancelledAppointments,
        totalRevenue,
        totalReviews,
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
const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.USERS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status: "suspended",
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
const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.USERS).updateOne(
      {
        _id: new ObjectId(id),
      },
      {
        $set: {
          status: "active",
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
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const result = await db.collection(COLLECTIONS.USERS).deleteOne({
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
module.exports = {
  getDashboardStats,
  getAllUsers,
  suspendUser,
  activateUser,
  deleteUser,
};
