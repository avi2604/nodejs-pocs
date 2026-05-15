const express = require("express");
const userRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../modals/user");
const validator = require("validator");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const errorMessages = require("../constants/errorMessages.json");

userRouter.post(
  "/registerUser",
  asyncHandler(async (req, res) => {
    const user = req.body;
    const { fistName, lastName, emailId, password, gander, age, skills } =
      req.body;

    if (!password) {
      throw new AppError(errorMessages.user.passwordRequired, 400);
    }

    if (!validator.isStrongPassword(password)) {
      throw new AppError(errorMessages.user.passwordNotStrongEnough, 400);
    }

    const ExistingUser = await User.findOne({ emailId: emailId });
    if (ExistingUser) {
      throw new AppError(errorMessages.user.userAlreadyExists, 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    const newUser = new User({
      fistName,
      lastName,
      emailId,
      password: hashedPassword,
      gander,
      age,
      skills,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: errorMessages.success.userSignedUp,
    });
  }),
);

userRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { emailId, password } = req.body;
    if (!emailId || !password) {
      throw new AppError(errorMessages.user.emailAndPasswordRequired, 400);
    }

    if (!validator.isEmail(emailId)) {
      throw new AppError(errorMessages.user.invalidEmailFormat, 400);
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new AppError(errorMessages.user.userNotFound, 404);
    }

    await user.validatePassword(password, user.password);
    user.addCookie(res);
    res.json({
      success: true,
      message: errorMessages.success.loginSuccessful,
    });
  }),
);

userRouter.get("/logout", auth, (req, res) => {
  if (req.user) {
    res.clearCookie("token", { httpOnly: true });
    res.json({
      success: true,
      message: errorMessages.success.userLoggedOut,
    });
  }
});

module.exports = userRouter;
