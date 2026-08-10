const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/database");
const userModel = require("./models/user");


const app = express();

app.use(express.json());

app.post("/signup", async(req,res)=>{
  const user = req.body;
  if(!user) return res.status(400).send("User data is required");
  const newUser = new userModel(user);
  try {
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
})
app.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB().then(() =>{
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
})
.catch((err) => {
  console.error("Failed to connect to the database", err);
})

