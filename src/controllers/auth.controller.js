const jwt = require("jsonwebtoken");

const createJWT = (req, res) => {
  const user = req.body;

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.send({
    success: true,
    token,
  });
};

module.exports = {
  createJWT,
};
