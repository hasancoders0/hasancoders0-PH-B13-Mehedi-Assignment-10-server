const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const totalUsers = await db
      .collection(COLLECTIONS.USERS)
      .countDocuments();

    const totalDoctors = await db
      .collection(COLLECTIONS.DOCTORS)
      .countDocuments();

    const totalAppointments = await db
      .collection(COLLECTIONS.APPOINTMENTS)
      .countDocuments();

    const totalPayments = await db
      .collection(COLLECTIONS.APPOINTMENTS)
      .countDocuments({
        paymentStatus: "paid",
      });

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalDoctors,
        totalAppointments,
        totalPayments,
      },
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
};