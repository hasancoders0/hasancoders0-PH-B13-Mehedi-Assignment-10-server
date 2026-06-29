const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  suspendUser,
  activateUser,
  deleteUser,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);

router.get("/users", getAllUsers);

router.patch("/users/:id/suspend", suspendUser);

router.patch("/users/:id/activate", activateUser);

router.delete("/users/:id", deleteUser);

module.exports = router;
