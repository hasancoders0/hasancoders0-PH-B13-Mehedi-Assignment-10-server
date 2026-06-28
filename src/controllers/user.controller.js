const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

const createUser = async (req, res) => {
  try {
    const user = req.body;

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Request body is missing",
      });
    }

    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const db = client.db("medicare-connect");

    const usersCollection = db.collection(COLLECTIONS.USERS);

    const existingUser = await usersCollection.findOne({
      email: user.email,
    });

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "User already exists",
      });
    }

    const result = await usersCollection.insertOne({
      ...user,
      role: "patient",
      createdAt: new Date(),
    });

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

const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;

    const db = client.db("medicare-connect");

    const usersCollection = db.collection(COLLECTIONS.USERS);

    const user = await usersCollection.findOne({
      email,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUserByEmail,
};