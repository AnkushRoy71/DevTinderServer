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
const { pubClient, subClient } = require("./utils/redis");
require('./utils/emailWorkers')
//require("./utils/cronJobs");

const app = express();
const server = http.createServer(app);

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










const startServer = async () => {
  try {
    await Promise.all([pubClient.connect(), subClient.connect()]);
    await connectDB();
    initializeSocket(server, pubClient, subClient);
    server.listen(process.env.PORT ||  3000, () => {
      console.log("Server running on port 3000");
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exitCode = 1;
  }
};

startServer();
