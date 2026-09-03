const authRouter = require('express').Router();
const { userAuth } = require('../middlewares/userAuth.js');
const userModel = require('../models/user.js');
const { isRequestBodyValid, isPasswordStrong } = require("../utils/validation");
const bcrypt = require("bcrypt");


authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Email and password are required");
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("Invalid credentials");
    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid) throw new Error("Invalid credentials");
    const jwtToken = await user.getJWT();
    res.cookie("token", jwtToken, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    });
    res.status(200).send({
      message: "User logged in successfully",
      data: user
    });
  } catch (err) {
    res.status(500).send({error: "Error logging in user" + err.message});
  }
});

authRouter.post("/signup", async (req, res) => {
    try {
      const user = req.body;
      if (!user || !isRequestBodyValid(user))
        throw new Error("User data is invalid");
      const newUser = new userModel({
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        email: user.email,
        password: user.password,
        gender: user.gender
      });
      console.log(newUser)
      const hashedPassword = await newUser.hashedPassword();
      newUser.password = hashedPassword;
      await newUser.save();
      res.status(201).send("User created successfully");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error creating user " + err.message);
    }
});

authRouter.get('/logout',(req, res)=>{
  res.cookie('token', null, {expires: new Date().now, httpOnly:true});
  res.status(200).send({ message: "Logout successful" });
});

authRouter.patch('/forgotPassword',userAuth,async (req, res)=>{
  try{
    const user = req.user;
    const {password}  = req.body;
    if(isPasswordStrong(password)){
      user.password = password;
      const newHashedPassword = await user.hashedPassword(password);
      user.password = newHashedPassword;
      user.save();
      res.status(200).send("password reset succesfull");
    }
  }
  catch(err){
    res.status(400).send("Error updating password " + err.message);
  }
})

module.exports = {
    authRouter
}