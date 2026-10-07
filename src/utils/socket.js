const socketIO = require("socket.io");

const initializeSocket = (server) => {
    const io = socketIO(server, {
        cors:{
            origin: 'http://localhost:4200',
        }
    })

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("joinChat",()=>{});

      socket.on("sendMessage", (message) => {
        console.log("Message received:", message);
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
}

module.exports = {initializeSocket}