const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  makeAdmin,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/dashboard-stats", getDashboardStats);

router.get("/users", getAllUsers);

router.patch("/users/:id/admin", makeAdmin);

module.exports = router;