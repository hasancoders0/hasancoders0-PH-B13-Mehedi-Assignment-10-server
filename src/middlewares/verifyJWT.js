const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }

  const token = authorization.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    if (error) {
      console.log(error);

      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.decoded = decoded;
    next();
  });
};

module.exports = verifyJWT;
