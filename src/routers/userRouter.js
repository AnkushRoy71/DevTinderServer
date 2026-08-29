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

module.exports = userRouter;