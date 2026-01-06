const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const UserSchema = new mongoose.Schema(
  {
    fistName: {
      type: String,
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
      validate: validator.isStrongPassword,
    },
    gander: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (!["male", "female", "other"].includes(v.toLowerCase())) {
            throw new Error("Gender is not valid");
          }
        },
      },
    },
    age: { type: Number, required: true, minLength: 18, maxLength: 50 },
    skills: { type: [String] },
  },
  { timestamps: true }
);

UserSchema.methods.addCookie = function (res) {
  const token = jwt.sign({ emailId: this.emailId }, "DevTinder@2026", {
    expiresIn: "1h",
  });
  res.cookie("token", token, { httpOnly: true });
  return token;
};

UserSchema.methods.validatePassword = async function (hashedPassword) {
  const isPasswordValid = await bcrypt.compare(this.password, hashedPassword);
  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }
};

module.exports = mongoose.model("User", UserSchema);
