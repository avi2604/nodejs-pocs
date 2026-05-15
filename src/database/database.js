const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://avi2604:679zHRuH9BRVliuW@cluster0.ucspnx5.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
