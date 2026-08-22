const userRouter = require("express").Router();
const { userAuth } = require("../middlewares/userAuth.js");
const userModel = require("../models/user.js");

userRouter.get("/feed", async (req, res) => {
  try {
    const feed = await userModel.find();
    if (feed.length === 0) return res.status(404).send("No feed available");
    res.status(200).json(feed);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching feed");
  }
});

userRouter.get("/user", userAuth, async (req, res) => {
  try {
    const emailId = req.body.email;
    // if (!emailId) return res.status(400).send("Email is required");
    const users = req.user;
    if (users.length === 0) return res.status(404).send("User not found");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

userRouter.patch("/user/:id", async (req, res) => {
  console.log("hit");
  try {
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).send("User not found");
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

userRouter.delete("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await userModel.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
  }
});

module.exports = {
    userRouter
}