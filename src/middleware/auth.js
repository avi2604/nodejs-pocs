const jwt = require("jsonwebtoken");
const User = require("../modals/user");
const AppError = require("../utils/AppError");
const errorMessages = require("../constants/errorMessages.json");

const auth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new AppError(errorMessages.auth.userNotAuthenticated, 401);
    }
    const decodeToken = jwt.verify(token, "DevTinder@2026");
    if (!decodeToken.emailId) {
      throw new AppError(errorMessages.auth.invalidToken, 401);
    }
    const user = await User.findOne({ emailId: decodeToken.emailId });
    if (!user) {
      throw new AppError(errorMessages.auth.userNotFound, 401);
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
