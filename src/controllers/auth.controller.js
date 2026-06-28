const jwt = require("jsonwebtoken");

const createJWT = (req, res) => {
  const user = req.body;

  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    success: true,
    token,
  });
};

module.exports = {
  createJWT,
};