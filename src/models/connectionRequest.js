const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  status:{
    type: String,
    enum: ['like','dislike','accepted','rejected'],
    required: true
  }
});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
module.exports = ConnectionRequest;