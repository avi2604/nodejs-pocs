const express = require("express");
const app = express();
const port = 3000;

app.get("/user/:id", (req, res) => {
  console.log(req.query);
  res.send({
    name: "John Doe",
    location: "New York",
  });
});

app.post("/user", (req, res) => {
  console.log(req.body);
  res.send({
    status: "User created successfully",
  });
});

app.delete("/user/:id", (req, res) => {
  res.send({
    status: "User deleted successfully",
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
