const mongoose = require('mongoose');


const connectionRequestSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    require: true,
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
    ref:"User",
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
    throw  new Error("Sender and Reciever can't be same person");
  }
})

connectionRequestSchema.index({senderId:1, renderId:1});
connectionRequestSchema.index({status:1});

const ConnectionRequest = mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema,
);
module.exports = ConnectionRequest;