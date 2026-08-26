const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
  senderID: {
    type: mongoose.Types.ObjectId,
    require: true,
  },
  receiverID: {
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