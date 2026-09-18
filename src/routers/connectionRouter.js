const express = require('express');
const { userAuth } = require('../middlewares/userAuth');
const connectionRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest')
const User = require("../models/user")
const {emailQueue} = require('../utils/connection');
const { delay } = require('bullmq');

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
            throw new Error('connection already exists');
        }
    
        const connection = new ConnectionRequest({
            receiverId: receiverId,
            senderId: user._id,
            status: status
        })
    
        await emailQueue.add('emails',{connection},{delay: 2 * 60 * 1000});
        await connection.save();
        console.log('hi')
        res.status(200).send({message:'connection sent successfully', data:null});

    }
    catch(err){
        res.status(400).send({message:'error sending connection request ',error: err.message})
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
            throw Error(`${status} is not a valid status`);
        }
    
        const connectionRequest = await ConnectionRequest.findOne({
          _id: requestId,
          receiverId: senderId,
          status: "like",
        });
    
        if (!connectionRequest) {
           throw Error("Not a valid request");
        };

        connectionRequest.status = status;
        await connectionRequest.save();

        return res.status(200).send({message:"Connection accepted", data:null});
    }
    catch(err){
        return res.status(400).send({message:"something went wrong ", error: err.message});
    }

});


module.exports = {
    connectionRouter
};