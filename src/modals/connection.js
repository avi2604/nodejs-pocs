const mongoose = require("mongoose");
const User = require("./user");
const errorMessages = require("../constants/errorMessages.json");
const ConnectionSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      enum: {
        values: ["accept", "decline", "approved", "rejected"],
        message: errorMessages.connection.provideValidStatus,
      },
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserConnection", ConnectionSchema);
