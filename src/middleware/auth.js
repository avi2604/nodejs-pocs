const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).send("User not authenticated");
  }
  const decodeToken = jwt.verify(token, "DevTinder@2026");
  if (!decodeToken.emailId) {
    throw new Error("Invalid Token");
  }
  req.decodeToken = decodeToken;
  next();
};

module.exports = auth;
