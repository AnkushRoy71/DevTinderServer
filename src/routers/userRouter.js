const userRouter = require("express").Router();
const {userAuth} = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest")

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

module.exports = userRouter;