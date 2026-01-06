const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://avi2604:n1oZO4l5diLRkPDi@cluster0.ucspnx5.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
