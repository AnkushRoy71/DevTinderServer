const socketIO = require("socket.io");

const createRoomId = (senderId, receiverId) =>
  `chat_${[String(senderId), String(receiverId)].sort().join("_")}`;

const initializeSocket = (server) => {
    const io = socketIO(server, {
        cors:{
            origin: 'http://localhost:4200',
            credentials: true,
        }
    })

    io.on("connection", (socket) => {
      console.log("A user connected");

      socket.on("joinChat", (participants = {}) => {
        const { senderId, receiverId } = participants || {};

        if (!senderId || !receiverId) {
          console.error("joinChat requires senderId and receiverId");
          return;
        }

        const roomId = createRoomId(senderId, receiverId);
        socket.join(roomId);
        console.log(`Socket joined chat room: ${roomId}`);
      });

      socket.on("sendMessage", (messageData = {}) => {
        const { senderId, receiverId, message } = messageData || {};


        if (!senderId || !receiverId || message === undefined || message === null) {
          console.error("sendMessage requires senderId, receiverId, and message");
          return;
        }

        const roomId = createRoomId(senderId, receiverId);
        console.log(`Sending message to room: ${roomId}`);
        io.to(roomId).emit("receiveMessage", { senderId, receiverId, message });
      });

      socket.on("disconnect", () => {
        console.log("A user disconnected");
      });
    });
}

module.exports = {initializeSocket}