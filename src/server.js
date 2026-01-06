const express = require("express");
const app = express();
const connectDB = require("./database/database");
const User = require("./modals/user");
const port = 3000;
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

// Middleware
app.use(express.json());
app.use(cookieParser());

app.post("/registerUser", async (req, res) => {
  const user = req.body;
  try {
    const { fistName, lastName, emailId, password, gander, age, skills } =
      req.body;

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
    res.send("User signed up successfully");
  } catch (err) {
    res.status(500).send("ERROR: " + err.message);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(500).send("Error fetching users");
  }
});

app.get("/user", async (req, res) => {
  const userID = req.body.userId;
  try {
    const userObj = await User.findById(userID);
    res.send(userObj);
  } catch (error) {
    res.status(500).send("Error fetching user");
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  console.log(userId);
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.send(deletedUser);
  } catch (error) {
    res.status(500).send("Error deleting user");
  }
});

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const updatedData = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      returnDocument: "after",
    });
    res.send(updatedUser);
  } catch (error) {
    res.status(500).send("Error updating user");
  }
});

app.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.decodeToken.emailId });
    res.send(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get("/sendConnection", auth, (req, res) => {
  try {
    res.send(req.decodeToken.emailId + " sent connection request");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { emailId, password } = req.body;
  try {
    if (!validator.isEmail(emailId)) {
      throw new Error("Invalid email format");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("User not found");
    }

    user.validatePassword(user.password);
    user.addCookie(res);
    res.send("Login successful");
  } catch (error) {
    return res.status(400).send("Login failed: " + error.message);
  }
});

connectDB().then(
  () => {
    console.log("Connected to database");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  },
  (err) => {
    console.log("Failed to connect to database", err);
  }
);
