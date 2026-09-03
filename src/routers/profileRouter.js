const profileRouter = require("express").Router();
const { userAuth } = require("../middlewares/userAuth.js");
const userModel = require("../models/user.js");
const { isUpdateUserValid } = require('../utils/validation.js')


profileRouter.get("/user", userAuth, async (req, res) => {
  try {
    const users = req.user;
    if (users.length === 0) return res.status(404).send("User not found");
    res.status(200).json({ 
      message: "User fetched successfully",
      data:users
     });
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" , error: err.message});
  }
});

profileRouter.patch("/user",userAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const updatedData = req.body;
    console.log(updatedData)
    if(!isUpdateUserValid(updatedData)) throw new Error('Invalid data')
    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) return res.status(404).send("User not found");
    res.status(200).json({ 
      message: "User updated successfully",
      data: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err.message });
  }
});

profileRouter.delete("/user/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    await userModel.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

module.exports = {
    profileRouter
}