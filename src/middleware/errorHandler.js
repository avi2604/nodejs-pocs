const AppError = require("../utils/AppError");
const errorMessages = require("../constants/errorMessages.json");

const notFoundHandler = (req, res, next) => {
  next(
    new AppError(
      `${errorMessages.common.routeNotFoundPrefix} ${req.method} ${req.originalUrl}`,
      404,
    ),
  );
};

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;
  let message = error.message || errorMessages.common.internalServerError;
  let details = error.details || null;

  if (error.name === "ValidationError") {
    statusCode = 400;
    message = errorMessages.common.validationFailed;
    details = Object.values(error.errors).map((item) => item.message);
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = `${errorMessages.common.invalidFieldPrefix} ${error.path}`;
  } else if (error.code === 11000) {
    statusCode = 409;
    message = errorMessages.common.duplicateValueDetected;
    details = error.keyValue;
  } else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = errorMessages.auth.invalidToken;
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = errorMessages.auth.tokenExpired;
  }

  res.status(statusCode).json({
    success: false,
    message,
    details,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
