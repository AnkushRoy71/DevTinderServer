const userRouter = require("express").Router();
const {userAuth} = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/users/request", userAuth, async (req, res)=>{
    try{

        const user = req.user;
    
        const connectionRequest = await ConnectionRequest.find({
            receiverId: user._id,
            status: 'like'
        }).populate("senderId", ["firstName", "lastName", "age", "gender"])
    
        return res.json({
            message:"Connections fetched successfully",
            data: connectionRequest
        })
    }
    catch(err){
        return res.status(400).send("something went wrong "+ err.message);
    }
})


userRouter.get("/users/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { senderId: user._id, status: "accepted" },
        { receiverId: user._id, status: "accepted" },
      ],
    })
      .populate("senderId", ["firstName", "lastName", "age", "gender"])
      .populate("receiverId", ["firstName", "lastName", "age", "gender"]);

    const data = connectionRequest.map((row)=>{
        if(row.senderId._id.toString() === user._id.toString()){
            return row.receiverId;
        }
        else return row.senderId;
    })

    return res.json({
      message: "Connections fetched successfully",
      data: data,
    });
  } catch (err) {
    return res.status(400).send("something went wrong " + err.message);
  }
});

userRouter.get("/users/feed", userAuth, async(req, res)=>{
  try{
    const user = req.user;
  
    const allConnections = await ConnectionRequest.find({
      $or: [{ senderId: user._id }, { receiverId: user._id }],
    }).select("senderId receiverId");
  
    const hideUsers =  new Set();
  
    allConnections.forEach((connection)=>{
      hideUsers.add(connection.senderId);
      hideUsers.add(connection.receiverId);
    });
  
    hideUsers.add(user._id);
  
    const allowedUsers = await User.find({
      _id: {$nin: Array.from(hideUsers)}
    }).select("firstName lastName age gender")

    return res.json({
      message: "Data fetched Successfully",
      data: allowedUsers
    })
  }
  catch(err){
    return res.status(400).send("Something went wrong "+ err.message);
  }
})

module.exports = userRouter;