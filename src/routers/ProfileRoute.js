const express = require("express");
const profileRouter = express.Router();
const User = require("../modals/user");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const errorMessages = require("../constants/errorMessages.json");

profileRouter.get("/getFeed", asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json({
    success: true,
    data: users,
  });
}));

profileRouter.get("/getUserByID", asyncHandler(async (req, res) => {
  const userID = req.body.userId;
  if (!userID) {
    throw new AppError(errorMessages.profile.userIdRequired, 400);
  }

  const userObj = await User.findById(userID);
  if (!userObj) {
    throw new AppError(errorMessages.profile.userNotFound, 404);
  }

  res.json({
    success: true,
    data: userObj,
  });
}));

profileRouter.delete("/deleteUserById", asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  if (!userId) {
    throw new AppError(errorMessages.profile.userIdRequired, 400);
  }

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new AppError(errorMessages.profile.userNotFound, 404);
  }

  res.json({
    success: true,
    data: deletedUser,
  });
}));

profileRouter.patch("/updateUserProfile", asyncHandler(async (req, res) => {
  const userId = req.body.userId;
  const updatedData = req.body;
  if (!userId) {
    throw new AppError(errorMessages.profile.userIdRequired, 400);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!updatedUser) {
    throw new AppError(errorMessages.profile.userNotFound, 404);
  }

  res.json({
    success: true,
    data: updatedUser,
  });
}));

profileRouter.get("/getUserProfile", auth, asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
}));

module.exports = profileRouter;
