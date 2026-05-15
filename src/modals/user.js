const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utils/AppError");
const errorMessages = require("../constants/errorMessages.json");
const UserSchema = new mongoose.Schema(
  {
    fistName: {
      type: String,
      index: true,
      required: true,
      minLength: [3, "Must be at least 3"],
      maxLength: [50, "Must be at most 50"],
    },
    lastName: { type: String, minLength: 3, maxLength: 50 },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: validator.isEmail,
    },
    password: {
      type: String,
      required: true,
    },
    gander: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!["male", "female", "other"].includes(v.toLowerCase())) {
            throw new Error(errorMessages.user.genderNotValid);
          }
        },
      },
    },
    age: { type: Number, required: true, min: 18, max: 50 },
    skills: { type: [String] },
  },
  { timestamps: true },
);

UserSchema.methods.addCookie = function (res) {
  const token = jwt.sign({ emailId: this.emailId }, "DevTinder@2026", {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
  res.header("Authorization", `Bearer ${token}`);
  return token;
};

UserSchema.methods.validatePassword = async function (
  password,
  hashedPassword,
) {
  const isPasswordValid = await bcrypt.compare(password, hashedPassword);
  if (!isPasswordValid) {
    throw new AppError(errorMessages.auth.wrongPassword, 401);
  }
};

module.exports = mongoose.model("User", UserSchema);
