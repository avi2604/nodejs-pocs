const express = require("express");
const app = express();
const cors = require("cors");
const connectDB = require("./database/database");
const port = 3000;
const cookieParser = require("cookie-parser");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

// Middleware

app.use(express.json());
app.use(cookieParser());
app.use(cors({ 
  origin: "http://localhost:5173",
  credentials: true,
}));

//Routers
const userRouter = require("./routers/UserRoute");
const profileRouter = require("./routers/ProfileRoute");
const connectionRoute = require("./routers/ConnectionRouter");
app.use("/", userRouter);
app.use("/", profileRouter);
app.use("/", connectionRoute);
app.use(notFoundHandler);
app.use(errorHandler);


// Db Connections
connectDB().then(
  () => {
    console.log("Connected to database");
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  },
  (err) => {
    console.log("Failed to connect to database", err);
  },
);
