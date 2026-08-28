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
},{
  timestamps: true
});

connectionRequestSchema.pre('save', function(){
  let connection = this;
  if (connection.receiverId.equals(connection.senderId)) {
    throw new Error("Sender and Reciever can't be same person");
  }
  next();
})

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
module.exports = ConnectionRequest;