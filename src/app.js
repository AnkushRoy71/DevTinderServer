const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/database");
const cookieParse = require('cookie-parser');
const { authRouter } = require("./routers/authRouter");
const { profileRouter } = require("./routers/profileRouter");
const {connectionRouter} = require("./routers/connectionRouter")
const userRouter = require("./routers/userRouter")
const cors = require('cors');
const http = require('http');
const { initializeSocket } = require("./utils/socket");
require('./utils/emailWorkers')
//require("./utils/cronJobs");

const app = express();
const server = http.createServer(app);
initializeSocket(server);

app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());
app.use(cookieParse());



app.use('/', authRouter);
app.use('/',profileRouter);
app.use('/',connectionRouter);
app.use('/',userRouter);










connectDB()
  .then(() => {
    server.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database", err);
  });
