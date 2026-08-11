const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/database");
const userModel = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = req.body;
  if (!user) return res.status(400).send("User data is required");
  const newUser = new userModel(user);
  try {
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

app.get("/user", async (req, res) => {
  try {
    const emailId = req.body.email;
    if (!emailId) return res.status(400).send("Email is required");
    const users = await userModel.find({ email: emailId });
    if (users.length === 0) return res.status(404).send("User not found");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const feed = await userModel.find();
    if (feed.length === 0) return res.status(404).send("No feed available");
    res.status(200).json(feed);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching feed");
  }
});
app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
