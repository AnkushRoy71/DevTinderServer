const authRouter = require('express').Router();
const userModel = require('../models/user.js');
const { isRequestBodyValid } = require("../utils/validation");
const bcrypt = require("bcrypt");


authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Email and password are required");
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("Invalid credentials");
    const isPasswordValid = await user.hashedPassword(password);
    if (!isPasswordValid) throw new Error("Invalid credentials");
    const jwtToken = await user.getJWT();
    res.cookie("token", jwtToken, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });
    res.status(200).send("User logged in successfully");
  } catch (err) {
    res.status(500).send("Error logging in user" + err.message);
  }
});

authRouter.post("/signup", async (req, res) => {
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

module.exports = {
    authRouter
}