const express = require("express");
const {
  createUser,
} = require("../controllers/user.controller");

const router = express.Router();

router.post("/", createUser);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Users route working ✅",
  });
});

module.exports = router;