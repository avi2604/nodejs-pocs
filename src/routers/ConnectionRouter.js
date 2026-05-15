const express = require("express");
const connectionRouter = express.Router();
const auth = require("../middleware/auth");
const UserConnection = require("../modals/connection");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const errorMessages = require("../constants/errorMessages.json");

connectionRouter.get(
  "/sendConnection",
  auth,
  asyncHandler(async (req, res) => {
    res.json({
      success: true,
      message: `${req.user.emailId} ${errorMessages.success.connectionSentSuffix}`,
    });
  }),
);

connectionRouter.post(
  "/createConnectionRequest/:status/:senderUserId",
  auth,
  asyncHandler(async (req, res) => {
    const loggedInUser = req.user;
    const { status, senderUserId } = req.params;

    if (!["accept", "decline"].includes(status)) {
      throw new AppError(errorMessages.connection.invalidStatus, 400);
    }

    if (loggedInUser._id.equals(senderUserId)) {
      throw new AppError(errorMessages.connection.cannotConnectToSelf, 400);
    }

    const existingConnection = await UserConnection.findOne({
      $or: [
        { fromUserId: senderUserId, toUserId: loggedInUser._id },
        { fromUserId: loggedInUser._id, toUserId: senderUserId },
      ],
    });

    if (existingConnection) {
      throw new AppError(errorMessages.connection.connectionAlreadyExists, 409);
    }

    const newConnection = new UserConnection({
      fromUserId: loggedInUser._id,
      toUserId: senderUserId,
      status: status,
    });

    await newConnection.save();
    res.status(201).json({
      success: true,
      message: errorMessages.success.connectionEstablished,
    });
  }),
);

connectionRouter.post(
  "/request/review",
  auth,
  asyncHandler(async (req, res) => {
    const { toUserId, status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      throw new AppError(errorMessages.connection.invalidStatus, 400);
    }
    console.log(req.user);

    const connection = await UserConnection.findOne({
      toUserId: req.user._id,
      fromUserId: toUserId,
    });

    if (!connection) {
      throw new AppError(
        errorMessages.connection.invalidConnectionRequest,
        404,
      );
    }
    connection.status = status;
    await connection.save();
    res.json({
      success: true,
      message: errorMessages.success.connectionUpdated,
    });
  }),
);

connectionRouter.get(
  "/getUserConnections",
  auth,
  asyncHandler(async (req, res) => {
    const loggedInUserId = req.user._id;

    const connections = await UserConnection.find({
      toUserId: loggedInUserId,
    }).populate("fromUserId toUserId", "emailId fistName lastName");

    res.json({
      success: true,
      data: connections,
    });
  }),
);

module.exports = connectionRouter;
