const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decoded.email;

    const db = client.db("medicare-connect");

    const user = await db
      .collection(COLLECTIONS.USERS)
      .findOne({ email });

    if (user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Forbidden access",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = verifyAdmin;