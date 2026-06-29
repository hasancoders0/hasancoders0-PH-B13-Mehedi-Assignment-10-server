const { ObjectId } = require("mongodb");

const COLLECTIONS = require("../constants/collections");
const { client } = require("../config/db");

const createDoctorRequest = async (req, res) => {
  try {
    const db = client.db("medicare-connect");

    const request = req.body;

    const existingRequest = await db
      .collection(COLLECTIONS.DOCTOR_REQUESTS)
      .findOne({
        email: request.email,
        status: {
          $in: ["pending", "approved"],
        },
      });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message:
          "You already have an active doctor application.",
      });
    }

    const result = await db
      .collection(COLLECTIONS.DOCTOR_REQUESTS)
      .insertOne({
        ...request,
        status: "pending",
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

const getDoctorRequestByEmail = async (
  req,
  res
) => {
  try {
    const { email } = req.params;

    const db = client.db("medicare-connect");

    const request = await db
      .collection(COLLECTIONS.DOCTOR_REQUESTS)
      .findOne({
        email,
      });

    res.json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllDoctorRequests = async (
  req,
  res
) => {
  try {
    const db = client.db("medicare-connect");

    const requests = await db
      .collection(COLLECTIONS.DOCTOR_REQUESTS)
      .find()
      .sort({
        createdAt: -1,
      })
      .toArray();

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveDoctorRequest = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    const request = await db
      .collection(COLLECTIONS.DOCTOR_REQUESTS)
      .findOne({
        _id: new ObjectId(id),
      });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    await db
      .collection(COLLECTIONS.USERS)
      .updateOne(
        {
          email: request.email,
        },
        {
          $set: {
            role: "doctor",
            updatedAt: new Date(),
          },
        }
      );

    const existingDoctor = await db
      .collection(COLLECTIONS.DOCTORS)
      .findOne({
        email: request.email,
      });

    if (!existingDoctor) {
      await db
        .collection(COLLECTIONS.DOCTORS)
        .insertOne({
          name: request.name,
          email: request.email,
          specialization:
            request.specialization,
          qualification:
            request.qualification,
          hospital: request.hospital,
          experience:
            request.experience,
          consultationFee:
            request.consultationFee,
          photoURL: request.photoURL,
          about: request.about,
          licenseNumber:
            request.licenseNumber,
          availableDays: [],
          availableTimes: [],
          verificationStatus:
            "verified",
          createdAt: new Date(),
        });
    }

    await db
      .collection(COLLECTIONS.DOCTOR_REQUESTS)
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            status: "approved",
            approvedAt: new Date(),
          },
        }
      );

    res.json({
      success: true,
      message:
        "Doctor application approved successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectDoctorRequest = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const db = client.db("medicare-connect");

    await db
      .collection(COLLECTIONS.DOCTOR_REQUESTS)
      .updateOne(
        {
          _id: new ObjectId(id),
        },
        {
          $set: {
            status: "rejected",
            rejectedAt: new Date(),
          },
        }
      );

    res.json({
      success: true,
      message:
        "Doctor application rejected.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createDoctorRequest,
  getDoctorRequestByEmail,
  getAllDoctorRequests,
  approveDoctorRequest,
  rejectDoctorRequest,
};