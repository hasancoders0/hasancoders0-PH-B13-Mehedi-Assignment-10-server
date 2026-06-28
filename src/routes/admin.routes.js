const express = require("express");

const {
  getDashboardStats,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get(
  "/dashboard-stats",
  getDashboardStats
);

module.exports = router;