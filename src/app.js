const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/database");
const userModel = require("./models/user");
const { isRequestBodyValid } = require("./utils/validation");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

app.post("/login", async(req,res)=>{
  try{
    const {email, password} = req.body;
    if(!email || !password) throw new Error("Email and password are required");
    const user = await userModel.findOne({email});
    if(!user) throw new Error("Invalid credentials");
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) throw new Error("Invalid credentials");
    res.status(200).send("User logged in successfully");
  }
  catch(err){
    res.status(500).send("Error logging in user" + err.message);
  }
})

app.post("/signup", async (req, res) => {
    try {
      const user = req.body;
      if (!user || !isRequestBodyValid(user))
        throw new Error("User data is invalid");
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);
      const newUser = new userModel({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        password: hashedPassword,
        gender: user.gender
      });
      console.log(newUser);
      await newUser.save();
      res.status(201).send("User created successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating user" + err.message);
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

app.patch("/user/:id", async(req, res)=>{
  console.log("hit")
  try{
    const userId = req.params.id;
    const updatedData = req.body;
    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true, runValidators: true });
    if(!updatedUser) return res.status(404).send("User not found");
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating user");
  }
});

app.delete("/user/:id", async(req, res)=>{
  const userId = req.params.id;
  try{
    await userModel.findByIdAndDelete(userId);
    res.status(200).send("User deleted successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting user");
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
