const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const connectionRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')
const User = require("../models/user")

connectionRouter.post('/request/:status/:receiverId',userAuth,async (req, res)=>{
    try{

        const user = req.user;
        const receiverId = req.params.receiverId;
        const status = req.params.status;
    
        const statusAllowed = ['like','dislike']
        if(!statusAllowed.includes(status)){
            throw new Error('status not allowed');
        }
    
        const receiver = await User.findById(receiverId);
        if(!receiver){
            throw new Error('Receiver is not part of us');
        }


        const isPrevRequestExists = await ConnectionRequest.findOne({
          $or: [
            { senderId: user._id, receiverId: receiverId },
            { senderId: receiverId, receiverId: user._id },
          ],
        });


        if(isPrevRequestExists){
            return res.status(400).send('connection already exists');
        }
    
        const connection = new ConnectionRequest({
            receiverId: receiverId,
            senderId: user._id,
            status: status
        })
    
        await connection.save();
        res.status(200).send('connection sent successfully');
    }
    catch(err){
        res.status(400).send('error sending connection request '+ err.message)
    }
});

connectionRouter.post("/review/request/:status/:requestId", userAuth, async (req, res)=>{

    try{
        const user = req.user;
        const status  = req.params.status;
        const requestId = req.params.requestId;
        const senderId = user._id;
        const allowedStatus = ['accepted', 'rejected'];

        if(!allowedStatus.includes(status)){
            return res.status(400).send(`${status} is not a valid status`);
        }
    
        const connectionRequest = await ConnectionRequest.findOne({
          _id: requestId,
          receiverId: senderId,
          status: "like",
        });
    
        if (!connectionRequest) {
          return res.status(400).send("Not a valid request");
        };

        connectionRequest.status = status;
        await connectionRequest.save();

        return res.status(200).send("Connection accepted");
    }
    catch(err){
        return res.status(400).send("something went wrong "+ err.message);
    }

});


module.exports = {
    connectionRouter
};