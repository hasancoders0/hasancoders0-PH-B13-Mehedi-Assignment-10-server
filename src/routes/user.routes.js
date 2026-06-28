const express = require("express");

const {
  createUser,
} = require("../controllers/user.controller");

const verifyJWT = require(
  "../middlewares/verifyJWT"
);

const router = express.Router();

router.post("/", createUser);

router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Users route working ✅",
  });
});

router.get(
  "/me",
  verifyJWT,
  (req, res) => {
    res.json({
      success: true,
      user: req.decoded,
    });
  }
);

module.exports = router;