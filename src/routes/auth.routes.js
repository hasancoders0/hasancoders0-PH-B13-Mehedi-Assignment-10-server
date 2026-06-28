const express = require("express");
const { createJWT } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/jwt", createJWT);

module.exports = router;