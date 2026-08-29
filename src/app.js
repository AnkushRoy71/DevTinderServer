const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/database");
const cookieParse = require('cookie-parser');
const { authRouter } = require("./routers/authRouter");
const { profileRouter } = require("./routers/profileRouter");
const {connectionRouter} = require("./routers/connectionRouter")
const userRouter = require("./routers/userRouter")

const app = express();

app.use(express.json());
app.use(cookieParse());



app.use('/', authRouter);
app.use('/',profileRouter);
app.use('/',connectionRouter);
app.use('/',userRouter);










connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
